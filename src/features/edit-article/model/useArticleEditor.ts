import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";

import { type CoverScene } from "@/entities/article";
import type { ArticleCategory } from "@/entities/category";
import { countWords, pluralWords, readingMinutes, slugify } from "@/shared/lib";
import { cmsApi } from "@/shared/api/blog-api";

export type EditorStatus = "draft" | "published";

export const COVER_SCENES: CoverScene[] = [
  "journal",
  "schedule",
  "rating",
  "chat",
  "stats",
  "news",
  "brand",
];

const DRAFT_KEY = "bt_draft";
const PREVIEW_SLUG = "muit-cifrovoe-upravlenie";

interface Snapshot {
  id: string | null;
  title: string;
  excerpt: string;
  bodyHtml: string;
  cat: ArticleCategory;
  cover: CoverScene | null;
  status: EditorStatus;
  slug: string;
  date: string;
  seoTitle: string;
  seoDesc: string;
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
  return (match ?? categoriesList[0]).id;
}

/**
 * Build the POST/PATCH payload for /cms/articles/ per the API spec.
 * Field names: titleRu, excerptRu, contentRu, category (UUID string),
 * author (UUID string), slug, status, coverImageUrl, seoTitleRu, seoDescriptionRu.
 */
function buildArticlePayload(
  data: Snapshot,
  categoryUuid: string,
  authorUuid: string | null
) {
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
    coverImageUrl: data.cover
      ? `https://cdn.bilimtrack.com/blog/covers/${data.cover}.webp`
      : null,
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
  const getEditorHTMLRef = useRef<() => Promise<string>>(async () => "");
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

  const [articleId, setArticleId] = useState<string | null>(null);
  const [title, setTitle] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [cat, setCat] = useState<ArticleCategory>("cases");
  const [cover, setCover] = useState<CoverScene | null>(null);
  const [status, setStatus] = useState<EditorStatus>("draft");
  const [slug, setSlug] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [pubDate, setPubDate] = useState("");
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDesc, setSeoDesc] = useState("");

  const [categoriesList, setCategoriesList] = useState<
    { id: string; name: string; slug: string }[]
  >([]);
  const [authorsList, setAuthorsList] = useState<{ id: string; name: string }[]>([]);

  const [words, setWords] = useState(0);
  const [dirty, setDirty] = useState(false);
  const [initialHtml, setInitialHtml] = useState<string>("");
  const [isReady, setIsReady] = useState(false);

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

  const snapshot = async (): Promise<Snapshot> => {
    const bodyHtml = await getEditorHTMLRef.current();
    return {
      id: articleId,
      title,
      excerpt,
      bodyHtml,
      cat,
      cover,
      status,
      slug,
      date: pubDate,
      seoTitle,
      seoDesc,
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

    const categoryUuid = resolveCategoryUuid(categoriesList, data.cat);
    if (!categoryUuid) {
      // Categories not loaded yet — skip API save silently, will retry on next change
      return;
    }

    const authorUuid = authorsList[0]?.id ?? null;
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
        } else if (res && Object.keys(res).length > 0) {
          console.error("=== CMS CREATE ERROR ===", res);
        }
      }
    } catch (err) {
      console.error("Autosave API request failed:", err);
    }
  }, [articleId, title, excerpt, cat, cover, status, slug, pubDate, seoTitle, seoDesc, categoriesList, authorsList]);

  const markDirty = useCallback(() => {
    setDirty(true);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => save(), 1200);
  }, [save]);

  useEffect(() => {
    if (!mounted.current) return;
    markDirty();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title, excerpt, cat, cover, status, slug, pubDate, seoTitle, seoDesc]);

  const onBodyChange = useCallback(async () => {
    markDirty();
    const html = await getEditorHTMLRef.current();
    const text = html.replace(/<[^>]*>?/gm, " ");
    setWords(countWords(`${title} ${excerpt} ${text}`));
  }, [title, excerpt, markDirty]);

  const pickCover = useCallback((scene: CoverScene) => {
    setCover((cur) => (cur === scene ? null : scene));
  }, []);

  const ensureCover = useCallback(() => {
    setCover((cur) => cur ?? "journal");
  }, []);

  const editSlug = useCallback((value: string) => {
    setSlugTouched(true);
    setSlug(value);
  }, []);

  const saveDraft = useCallback(async () => {
    await save();
    showToast("Черновик сохранён", "check");
  }, [save, showToast]);

  // ---------------------------------------------------------------------------
  // publish()
  // ---------------------------------------------------------------------------
  const publish = useCallback(async () => {
    if (!title.trim()) {
      titleRef.current?.focus();
      showToast("Добавьте заголовок статьи", "bolt");
      return;
    }

    const token = localStorage.getItem("cms_token");
    if (!token) {
      showToast("Требуется авторизация", "bolt");
      router.push("/writer/login");
      return;
    }

    try {
      let currentId = articleId;

      if (!currentId) {
        const data = await snapshot();

        const categoryUuid = resolveCategoryUuid(categoriesList, data.cat);
        if (!categoryUuid) {
          showToast("Категории загружаются, подождите секунду и повторите", "bolt");
          return;
        }

        const authorUuid = authorsList[0]?.id ?? null;
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
          showToast("Ошибка создания: " + parseDjangoError(res?.data ?? res), "bolt");
          console.error("=== CMS CREATE ERROR ===", res);
          return;
        }
      }

      // Publish via dedicated endpoint
      if (currentId) {
        console.log("=== CMS PUBLISH article id ===", currentId);
        const res = await cmsApi.publishArticle(token, currentId);
        // Success: res may be empty 200 or { data: {...} }
        if (res?.detail || res?.error) {
          showToast("Ошибка публикации: " + parseDjangoError(res), "bolt");
          return;
        }
        setStatus("published");
        showToast("Статья успешно опубликована 🎉", "check");
      }
    } catch (e) {
      console.error("Publish error:", e);
      showToast("Сетевая ошибка при публикации", "bolt");
    }
  }, [articleId, title, categoriesList, authorsList, router, showToast]);

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
  // Restore draft from localStorage on mount
  // ---------------------------------------------------------------------------
  useEffect(() => {
    const seedExample = () => {
      setCat("cases");
      setCover("journal");
      setTitle("Как МУИТ перешёл на цифровое управление учебным процессом");
      setExcerpt(
        "Рассказываем, как международный университет автоматизировал расписание, журнал и оплату — и за один семестр избавился от бумажной рутины."
      );
      setInitialHtml(
        `<p>Когда набор вырос до полутора тысяч студентов, привычные таблицы перестали справляться.</p>`
      );
      setPubDate(todayISO());
    };

    const raw =
      typeof localStorage !== "undefined" && localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw) as Snapshot;
        setArticleId(d.id || null);
        setTitle(d.title || "");
        setExcerpt(d.excerpt || "");
        setCat(d.cat || "cases");
        setCover(d.cover ?? null);
        setStatus(d.status || "draft");
        setSlug(d.slug || "");
        if (d.slug) setSlugTouched(true);
        setPubDate(d.date || todayISO());
        setSeoTitle(d.seoTitle || "");
        setSeoDesc(d.seoDesc || "");
        setInitialHtml(d.bodyHtml || "");
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
  }, []);

  return {
    refs: { titleRef, excerptRef, getEditorHTMLRef },
    articleId,
    title,
    excerpt,
    cat,
    cover,
    status,
    slug,
    slugAuto: !slugTouched,
    pubDate,
    seoTitle,
    seoDesc,
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
    categoriesList,
    authorsList,
    setTitle,
    setExcerpt,
    setCat,
    setStatus,
    setPubDate,
    setSeoTitle,
    setSeoDesc,
    editSlug,
    onBodyChange,
    pickCover,
    ensureCover,
    saveDraft,
    publish,
    archive,
    preview,
    deleteDraft,
  };
}

export type ArticleEditorApi = ReturnType<typeof useArticleEditor>;
