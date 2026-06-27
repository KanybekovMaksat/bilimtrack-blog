import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { useRouter } from "next/router";
import { BlockNoteEditor, type PartialBlock } from "@blocknote/core";

import { type CoverScene } from "@/entities/article";
import type { ArticleCategory } from "@/entities/category";
import { countWords, pluralWords, readingMinutes, slugify } from "@/shared/lib";
import { cmsApi } from "@/shared/api/blog-api";

export type EditorStatus = "draft" | "published";

export const COVER_SCENES: CoverScene[] = [];

const DRAFT_KEY = "bt_draft";
const PREVIEW_SLUG = "muit-cifrovoe-upravlenie";

interface Snapshot {
  id: string | null;
  title: string;
  excerpt: string;
  bodyHtml: string;
  cat: ArticleCategory | "";
  cover: CoverScene | null;
  /** Real URL of the uploaded cover image — takes priority over CSS preset */
  coverImageUrl: string | null;
  status: EditorStatus;
  slug: string;
  date: string;
  seoTitle: string;
  seoDesc: string;
  selectedAuthorId: string | null;
  coverAspect?: string;
}

const todayISO = () => new Date().toISOString().slice(0, 10);

/**
 * Resolve the category UUID to send to the backend.
 * Priority:
 *   1. Category whose .slug matches the editor's current cat key
 *   2. First category in the list (safe fallback)
 *   3. null (caller must guard)
 */
function resolveCategoryUuid(
  categoriesList: { id: string; name: string; slug: string }[],
  catKey: string
): string | null {
  if (categoriesList.length === 0) return null;
  const match = categoriesList.find((c) => c.slug === catKey);
  return match?.id ?? null;
}

/**
 * Build the POST/PATCH payload for /cms/articles/ per the API spec.
 *
 * Field names: titleRu, excerptRu, contentRu, category (UUID string),
 * author (UUID string), slug, status, publishedAt (ISO 8601),
 * coverImageUrl, seoTitleRu, seoDescriptionRu.
 */
function buildArticlePayload(
  data: Snapshot,
  categoryUuid: string,
  authorUuid: string | null
) {
  // publishedAt: prefer the chosen date; if empty fall back to now (required by API)
  const publishedAt = data.date
    ? new Date(data.date).toISOString()
    : new Date().toISOString();

  // Cover: real uploaded URL takes priority over CSS-preset CDN path
  const coverImageUrl =
    data.coverImageUrl ??
    (data.cover
      ? `https://cdn.bilimtrack.com/blog/covers/${data.cover}.webp`
      : null);

  return {
    titleRu: data.title,
    excerptRu: data.excerpt,
    contentRu: data.bodyHtml,
    // Per spec: field name is 'category', value is UUID string
    category: categoryUuid,
    // author is optional — omit if null to avoid validation errors
    ...(authorUuid ? { author: authorUuid } : {}),
    status: data.status,
    slug: data.slug || slugify(data.title),
    publishedAt,
    coverImageUrl,
    // API does not accept null for SEO fields — fall back to title/excerpt
    seoTitleRu: data.seoTitle || data.title || "—",
    seoDescriptionRu: data.seoDesc || data.excerpt || "—",
  };
}

/** Parse a Django validation error response into a human-readable string */
function parseDjangoError(res: any): string {
  if (!res) return "Неизвестная ошибка";
  if (typeof res.detail === "string") return res.detail;
  if (typeof res.error === "string") return res.error;
  // DRF drf-spectacular style: { type, errors: [{attr, code, detail}] }
  if (Array.isArray(res.errors)) {
    return res.errors
      .map((e: { attr?: string; detail?: string }) =>
        e.attr ? `${e.attr}: ${e.detail}` : e.detail ?? JSON.stringify(e)
      )
      .join(" | ");
  }
  // Field-level errors: { category: ["may not be null"], title: ["required"] }
  const fieldErrors = Object.entries(res)
    .filter(([, v]) => Array.isArray(v))
    .map(([k, v]) => `${k}: ${(v as string[]).join(", ")}`)
    .join(" | ");
  if (fieldErrors) return fieldErrors;
  return JSON.stringify(res);
}

/** Check if an API response contains a slug-uniqueness error */
function hasSlugUniqueError(res: any): boolean {
  if (!res) return false;
  if (Array.isArray(res.errors)) {
    return res.errors.some(
      (e: { attr?: string; code?: string }) =>
        e.attr === "slug" && e.code === "unique"
    );
  }
  return false;
}

/** Append a short random 4-char suffix to make a slug unique */
function makeUniqueSlug(base: string): string {
  const suffix = Math.random().toString(36).slice(2, 6);
  return `${base}-${suffix}`;
}

export function useArticleEditor() {
  const router = useRouter();
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [cat, setCat] = useState<ArticleCategory | "">("");
  const [cover, setCover] = useState<CoverScene | null>(null);
  /** Real URL returned by the media upload endpoint — takes priority over CSS preset */
  const [coverImageUrl, setCoverImageUrl] = useState<string | null>(null);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [status, setStatus] = useState<EditorStatus>("draft");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [pubDate, setPubDate] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");
  const [selectedAuthorId, setSelectedAuthorId] = useState<string | null>(null);

  const [coverAspect, setCoverAspect] = useState<string>("16-9");

  const [errors, setErrors] = useState<Record<string, string>>({});

  const clearError = useCallback((field: string) => {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }, []);

  const [categoriesList, setCategoriesList] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [authorsList, setAuthorsList] = useState<{ id: string; name: string }[]>([]);

  const [words, setWords] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [initialHtml, setInitialHtml] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

  const [initialBlocks, setInitialBlocks] = useState<PartialBlock[] | undefined | "loading">("loading");

  useEffect(() => {
    if (!isReady) return;
    async function init() {
      if (initialHtml) {
        const temp = BlockNoteEditor.create();
        const blocks = await temp.tryParseHTMLToBlocks(initialHtml);
        setInitialBlocks(blocks);
      } else {
        setInitialBlocks(undefined);
      }
    }
    init();
  }, [initialHtml, isReady]);

  const blockNote = useMemo(() => {
    if (initialBlocks === "loading") return undefined;
    return BlockNoteEditor.create({
      initialContent: initialBlocks,
      uploadFile: async (file: File) => {
        const token = localStorage.getItem("cms_token");
        if (!token) return "";
        try {
          const result = await cmsApi.uploadCoverImage(token, file);
          return result?.url || "";
        } catch (err) {
          console.error("Editor image upload error:", err);
          return "";
        }
      },
    });
  }, [initialBlocks]);

  const editorInitialized = blockNote !== undefined;

  const [toast, setToast] = useState<{
    show: boolean;
    text: string;
    icon: string;
  }>({ show: false, text: "", icon: "check" });

  const readMinutes = readingMinutes(words);
  const wordLabel = `${words} ${pluralWords(words)}`;
  const seoTitleLen = (seoTitle || title).length;
  const seoDescLen = (seoDesc || excerpt).length;

  // Auto-resize textareas
  useEffect(() => {
    const el = titleRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [title]);

  useEffect(() => {
    const el = excerptRef.current;
    if (el) {
      el.style.height = "auto";
      el.style.height = `${el.scrollHeight}px`;
    }
  }, [excerpt]);

  // Auto-generate slug from title unless user touched it
  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const showToast = useCallback((text: string, icon = "check") => {
    setToast({ show: true, text, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2400
    );
  }, []);

  const getEditorHTML = useCallback(async () => {
    if (!blockNote) return initialHtml;
    return blockNote.blocksToFullHTML(blockNote.document);
  }, [blockNote, initialHtml]);

  const snapshot = async (): Promise<Snapshot> => {
    const bodyHtml = await getEditorHTML();
    return {
      id: articleId,
      title,
      excerpt,
      bodyHtml,
      cat,
      cover,
      coverImageUrl,
      status,
      slug,
      date: pubDate,
      seoTitle,
      seoDesc,
      selectedAuthorId,
      coverAspect,
    };
  };

  // ---------------------------------------------------------------------------
  // save() — localStorage + API autosave
  // ---------------------------------------------------------------------------
  const save = useCallback(async () => {
    const data = await snapshot();
    // Always persist to localStorage first (works offline / without auth)
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    setDirty(false);

    const token = localStorage.getItem("cms_token");
    if (!token) return; // Not logged in — localStorage-only save is fine

    // If category is not selected, skip API save silently
    if (!data.cat) return;

    const categoryUuid = resolveCategoryUuid(categoriesList, data.cat);
    if (!categoryUuid) {
      // Categories not loaded yet — skip API save silently, will retry on next change
      return;
    }

    // Author: prefer explicitly selected, do NOT fall back to first in list
    const authorUuid = data.selectedAuthorId ?? null;
    const payload = buildArticlePayload(data, categoryUuid, authorUuid);

    console.log("=== CMS SEND DATA ===", payload);

    try {
      if (articleId) {
        // PATCH existing article
        const res = await cmsApi.updateArticle(token, articleId, payload);
        if (res?.data?.id) {
          // id confirmed — all good
        } else if (res && (res.category || res.detail || res.error)) {
          console.error("=== CMS PATCH ERROR ===", res);
        }
      } else {
        // POST new article — capture the returned ID
        let createPayload = { ...payload };
        let res = await cmsApi.createArticle(token, createPayload);

        // If slug already exists, auto-suffix and retry once
        if (hasSlugUniqueError(res)) {
          const uniqueSlug = makeUniqueSlug(createPayload.slug);
          setSlug(uniqueSlug);
          setSlugTouched(true);
          createPayload = { ...createPayload, slug: uniqueSlug };
          res = await cmsApi.createArticle(token, createPayload);
        }

        if (res?.data?.id) {
          setArticleId(res.data.id);
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({ ...data, id: res.data.id })
          );
          // Upgrade URL silently to edit mode so page reload doesn't lose the session
          if (!router.query.id) {
            router.replace(`/writer/admin?id=${res.data.id}`, undefined, { shallow: true });
          }
        } else if (res && Object.keys(res).length > 0) {
          console.error("=== CMS CREATE ERROR ===", res);
        }
      }
    } catch (err) {
      console.error("Autosave API request failed:", err);
    }
  }, [articleId, title, excerpt, cat, cover, coverImageUrl, status, slug, pubDate, seoTitle, seoDesc, selectedAuthorId, categoriesList, authorsList, router]);

  const markDirty = useCallback(() => {
    setDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(), 1200);
  }, [save]);

  useEffect(() => {
    if (!mounted.current) return;
    markDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, excerpt, cat, cover, coverImageUrl, status, slug, pubDate, seoTitle, seoDesc, selectedAuthorId]);

  const onBodyChange = useCallback(async () => {
    markDirty();
    const html = await getEditorHTML();
    const text = html.replace(/<[^>]*>?/gm, " ");
    setWords(countWords(`${title} ${excerpt} ${text}`));
  }, [title, excerpt, markDirty, getEditorHTML]);

  const pickCover = useCallback((scene: CoverScene) => {
    // Selecting a CSS-preset clears any uploaded image URL
    setCoverImageUrl(null);
    setCover((cur) => (cur === scene ? null : scene));
  }, []);

  const removeCover = useCallback(() => {
    setCoverImageUrl(null);
    setCover(null);
  }, []);

  const ensureCover = useCallback(() => {
    setCover(null);
  }, []);

  const editSlug = useCallback((value: string) => {
    setSlugTouched(true);
    setSlug(value);
  }, []);

  // ---------------------------------------------------------------------------
  // uploadCover() — upload a real image file and store the returned URL
  // ---------------------------------------------------------------------------
  const uploadCover = useCallback(async (file: File) => {
    const token = localStorage.getItem("cms_token");
    if (!token) {
      showToast("Требуется авторизация для загрузки", "bolt");
      return;
    }

    setIsUploadingCover(true);
    try {
      const result = await cmsApi.uploadCoverImage(token, file);
      if (result?.url) {
        setCoverImageUrl(result.url);
        // Clear the CSS-preset selection — real image takes over
        setCover(null);
        showToast("Обложка загружена", "check");
        markDirty();
      } else {
        showToast("Не удалось загрузить обложку. Проверьте эндпоинт.", "bolt");
      }
    } catch (err) {
      console.error("uploadCover error:", err);
      showToast("Сетевая ошибка при загрузке обложки", "bolt");
    } finally {
      setIsUploadingCover(false);
    }
  }, [showToast, markDirty]);

  const saveDraft = useCallback(async () => {
    await save();
    showToast("Черновик сохранён", "check");
  }, [save, showToast]);

  const handleBackendErrors = useCallback((res: any) => {
    if (!res) return;
    const newErrors: Record<string, string> = {};

    Object.entries(res).forEach(([key, val]) => {
      if (Array.isArray(val)) {
        let mappedKey = key;
        if (key === "titleRu") mappedKey = "title";
        if (key === "excerptRu") mappedKey = "excerpt";
        if (key === "contentRu") mappedKey = "content";
        if (key === "author") mappedKey = "author";
        if (key === "category") mappedKey = "category";
        newErrors[mappedKey] = val.join(", ");
      } else if (typeof val === "string") {
        newErrors[key] = val;
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors((prev) => ({ ...prev, ...newErrors }));
      showToast("Ошибка валидации на сервере", "bolt");
    } else {
      showToast("Ошибка: " + parseDjangoError(res), "bolt");
    }
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // publish()
  // ---------------------------------------------------------------------------
  const publish = useCallback(async () => {
    if (isPublishing) return;
    
    // Clear errors
    setErrors({});

    let hasLocalErrors = false;
    const localErrors: Record<string, string> = {};

    if (!title.trim()) {
      localErrors.title = "Заголовок обязателен для заполнения";
      hasLocalErrors = true;
    }

    if (!cat) {
      localErrors.category = "Выберите категорию";
      hasLocalErrors = true;
    }

    if (!selectedAuthorId) {
      localErrors.author = "Выберите автора";
      hasLocalErrors = true;
    }

    if (hasLocalErrors) {
      setErrors(localErrors);
      showToast("Заполните обязательные поля", "bolt");
      if (localErrors.title) {
        titleRef.current?.focus();
      }
      return;
    }

    const token = localStorage.getItem("cms_token");
    if (!token) {
      showToast("Требуется авторизация", "bolt");
      router.push("/writer/login");
      return;
    }

    setIsPublishing(true);
    try {
      let currentId = articleId;

      if (!currentId) {
        const data = await snapshot();

        const categoryUuid = resolveCategoryUuid(categoriesList, data.cat);
        if (!categoryUuid) {
          showToast("Категория не найдена", "bolt");
          setIsPublishing(false);
          return;
        }

        const authorUuid = data.selectedAuthorId ?? null;
        const payload = buildArticlePayload(
          { ...data, status: "draft" },
          categoryUuid,
          authorUuid
        );

        console.log("=== CMS SEND DATA (publish step 1 — create) ===", payload);

        const res = await cmsApi.createArticle(token, payload);
        if (res?.data?.id) {
          currentId = res.data.id;
          setArticleId(currentId);
          localStorage.setItem(
            DRAFT_KEY,
            JSON.stringify({ ...data, id: currentId })
          );
        } else {
          if (res) {
            handleBackendErrors(res);
          } else {
            showToast("Ошибка создания статьи", "bolt");
          }
          console.error("=== CMS CREATE ERROR ===", res);
          setIsPublishing(false);
          return;
        }
      }

      // Publish via dedicated endpoint
      if (currentId) {
        console.log("=== CMS PUBLISH article id ===", currentId);
        const res = await cmsApi.publishArticle(token, currentId);
        // Success: res may be empty 200 or { data: {...} }
        if (res?.detail || res?.error) {
          const errStr = parseDjangoError(res);
          // Если бэкенд уже опубликовал её (например, из-за переданного publishedAt)
          // или если был случайный двойной клик — считаем это успехом
          if (errStr.toLowerCase().includes("опубликована")) {
             console.log("Article was already published by backend.");
          } else {
            if (res) {
              handleBackendErrors(res);
            } else {
              showToast("Ошибка публикации: " + errStr, "bolt");
            }
            setIsPublishing(false);
            return;
          }
        }
        setStatus("published");
        showToast("Статья успешно опубликована 🎉", "check");
        
        // Логическое завершение — перенаправляем к списку статей, 
        // дав пользователю время (1.5с) прочитать toast-уведомление.
        setTimeout(() => {
          router.push("/writer/articles");
        }, 1500);
        
        // Намеренно НЕ сбрасываем isPublishing(false), чтобы 
        // кнопки оставались заблокированными до ухода со страницы.
        return;
      }
    } catch (e) {
      console.error("Publish error:", e);
      showToast("Сетевая ошибка при публикации", "bolt");
      setIsPublishing(false);
    }
  }, [articleId, title, categoriesList, authorsList, router, showToast, isPublishing]);

  // ---------------------------------------------------------------------------
  // archive()
  // ---------------------------------------------------------------------------
  const archive = useCallback(async () => {
    const token = localStorage.getItem("cms_token");
    if (!token) {
      showToast("Требуется авторизация", "bolt");
      router.push("/writer/login");
      return;
    }

    if (!articleId) {
      showToast("Статья ещё не сохранена на сервере", "bolt");
      return;
    }

    try {
      const res = await cmsApi.archiveArticle(token, articleId);
      if (res?.error || res?.detail) {
        showToast("Ошибка архивации: " + parseDjangoError(res), "bolt");
        return;
      }
      setStatus("draft");
      showToast("Статья переведена в архив", "check");
    } catch (e) {
      console.error("Archive error:", e);
      showToast("Сетевая ошибка при архивации", "bolt");
    }
  }, [articleId, router, showToast]);

  const preview = useCallback(async () => {
    await save();
    window.open(`/blog/${slug || PREVIEW_SLUG}`, "_blank");
  }, [save, slug]);

  const deleteDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    setArticleId(null);
    showToast("Черновик удалён", "trash");
  }, [showToast]);

  // ---------------------------------------------------------------------------
  // Load categories & authors on mount (requires auth)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    if (!token) return;

    cmsApi
      .getCategories()
      .then((res) => {
        const list: any[] = res?.data ?? [];
        if (list.length > 0) {
          setCategoriesList(
            list.map((c: any) => ({
              id: c.id,
              name: c.nameRu ?? c.name ?? c.slug,
              slug: c.slug,
            }))
          );
        }
      })
      .catch((err) => console.error("Failed to load CMS categories:", err));

    cmsApi
      .getAuthors()
      .then((res) => {
        const list: any[] = res?.data ?? [];
        if (list.length > 0) {
          setAuthorsList(list.map((a: any) => ({ id: a.id, name: a.name })));
        }
      })
      .catch((err) => console.error("Failed to load CMS authors:", err));
  }, []);

  // ---------------------------------------------------------------------------
  // Load article by ?id= from URL query (edit mode)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    // router.query is populated after hydration — wait for it
    if (!router.isReady) return;

    const editId = router.query.id as string | undefined;
    if (!editId) return; // No id param — new article mode, handled by draft restore below

    const token = localStorage.getItem("cms_token");
    if (!token) return;

    cmsApi
      .getArticle(token, editId)
      .then((res) => {
        const item: any = res?.data ?? null;
        if (!item) {
          console.error("Article not found for id:", editId);
          return;
        }

        setArticleId(item.id ?? editId);
        setTitle(item.titleRu ?? item.title ?? "");
        setExcerpt(item.excerptRu ?? item.excerpt ?? "");

        // Map category slug → ArticleCategory key
        const catSlug: string = item.category?.slug ?? "";
        setCat(catSlug as ArticleCategory | "");

        // Cover: if a real URL is stored, set it directly
        if (item.coverImageUrl) {
          setCoverImageUrl(item.coverImageUrl);
          setCover(null);
        }

        setStatus(item.status === "published" ? "published" : "draft");
        setSlug(item.slug ?? "");
        if (item.slug) setSlugTouched(true);
        setPubDate(
          item.publishedAt
            ? item.publishedAt.slice(0, 10)
            : todayISO()
        );
        setSeoTitle(item.seoTitleRu ?? item.seoTitle ?? "");
        setSeoDesc(item.seoDescriptionRu ?? item.seoDesc ?? "");
        setInitialHtml(item.contentRu ?? item.content ?? "");

        // Pre-select author if one is set
        if (item.author?.id) {
          setSelectedAuthorId(item.author.id);
        }

        // Clear localStorage draft so it doesn't overwrite the loaded data
        localStorage.removeItem(DRAFT_KEY);
      })
      .catch((err) => console.error("Failed to load article for editing:", err))
      .finally(() => {
        // Mark as mounted and ready even if load failed
        setTimeout(() => {
          mounted.current = true;
          setIsReady(true);
        }, 0);
      });
  }, [router.isReady, router.query.id]);

  // ---------------------------------------------------------------------------
  // Restore draft from localStorage on mount (new article mode only)
  // ---------------------------------------------------------------------------
  useEffect(() => {
    if (!router.isReady) return;

    // If ?id= is present, the effect above handles loading — skip localStorage
    const editId = router.query.id as string | undefined;
    if (editId) return;

    const seedExample = () => {
      setCat("");
      setCover(null);
      setCoverImageUrl(null);
      setTitle("");
      setExcerpt("");
      setInitialHtml("");
      setPubDate(todayISO());
      setCoverAspect("16-9");
    };

    const raw =
      typeof localStorage !== "undefined" && localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw) as Snapshot;
        
        // Если черновик уже принадлежит сохранённой статье (есть ID) или опубликован, 
        // а пользователь зашёл на `/writer/admin` (без ?id=), значит он нажал "+ Новая статья".
        // Мы должны дать ему чистый лист, а не воскрешать прошлую статью.
        if (d.status === "published" || d.id) {
          localStorage.removeItem(DRAFT_KEY);
          seedExample();
          return;
        }

        setArticleId(d.id || null);
        setTitle(d.title || "");
        setExcerpt(d.excerpt || "");
        setCat(d.cat || "");
        setCover(d.cover ?? null);
        setCoverImageUrl(d.coverImageUrl ?? null);
        setStatus(d.status || "draft");
        setSlug(d.slug || "");
        if (d.slug) setSlugTouched(true);
        setPubDate(d.date || todayISO());
        setSeoTitle(d.seoTitle || "");
        setSeoDesc(d.seoDesc || "");
        setInitialHtml(d.bodyHtml || "");
        setSelectedAuthorId(d.selectedAuthorId ?? null);
        setCoverAspect(d.coverAspect || "16-9");
      } catch {
        seedExample();
      }
    } else {
      seedExample();
    }

    const id = setTimeout(() => {
      mounted.current = true;
      setIsReady(true);
    }, 0);

    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady, router.query.id]);

  return {
    refs: { titleRef, excerptRef },
    articleId,
    title,
    excerpt,
    cat,
    cover,
    coverImageUrl,
    isUploadingCover,
    isPublishing,
    status,
    slug,
    slugAuto: !slugTouched,
    pubDate,
    seoTitle,
    seoDesc,
    selectedAuthorId,
    words,
    wordLabel,
    readMinutes,
    seoTitleLen,
    seoDescLen,
    dirty,
    toast,
    scenes: COVER_SCENES,
    initialHtml,
    isReady,
    blockNote,
    editorInitialized,
    errors,
    clearError,
    coverAspect,
    setCoverAspect,
    categoriesList,
    authorsList,
    setTitle,
    setExcerpt,
    setCat,
    setStatus,
    setPubDate,
    setSeoTitle,
    setSeoDesc,
    setSelectedAuthorId,
    editSlug,
    onBodyChange,
    pickCover,
    removeCover,
    ensureCover,
    uploadCover,
    saveDraft,
    publish,
    archive,
    preview,
    deleteDraft,
  };
}

export type ArticleEditorApi = ReturnType<typeof useArticleEditor>;
