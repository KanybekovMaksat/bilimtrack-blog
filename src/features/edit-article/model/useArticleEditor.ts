import { useCallback, useEffect, useRef, useState } from "react";

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

export function useArticleEditor() {
  const titleRef = useRef<HTMLTextAreaElement>(null);
  const excerptRef = useRef<HTMLTextAreaElement>(null);
  
  // We'll store a ref to a function that retrieves current HTML from BlockNote
  const getEditorHTMLRef = useRef<() => Promise<string>>(async () => "");
  
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const mounted = useRef(false);

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

  useEffect(() => {
    if (!slugTouched) setSlug(slugify(title));
  }, [title, slugTouched]);

  const showToast = useCallback((text: string, icon = "check") => {
    setToast({ show: true, text, icon });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(
      () => setToast((t) => ({ ...t, show: false })),
      2400,
    );
  }, []);

  const snapshot = async (): Promise<Snapshot> => {
    const bodyHtml = await getEditorHTMLRef.current();
    return {
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

  const save = useCallback(async () => {
    const data = await snapshot();
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
    setDirty(false);
    
    // NOTE: For real CMS connection, we would save to API here
    // const token = localStorage.getItem("cms_token");
    // if (token) {
    //   await cmsApi.createArticle(token, { ...data, contentRu: data.bodyHtml });
    // }
  }, [title, excerpt, cat, cover, status, slug, pubDate, seoTitle, seoDesc]);

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
    // Simple word count from HTML stripping tags
    const text = html.replace(/<[^>]*>?/gm, ' ');
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

  const publish = useCallback(async () => {
    if (!title.trim()) {
      titleRef.current?.focus();
      showToast("Добавьте заголовок статьи", "bolt");
      return;
    }
    const data = await snapshot();
    
    try {
      let token = localStorage.getItem("cms_token");
      // If no token exists, fallback to a dummy token so the request is at least attempted
      if (!token) token = "dummy_test_token";

      // Send to real server with snake_case keys as required by API
      const res = await cmsApi.createArticle(token, {
          title_ru: data.title,
          excerpt_ru: data.excerpt,
          content_ru: data.bodyHtml,
          status: "published",
          slug: data.slug || "novaya-statya",
          category_id: "00000000-0000-0000-0000-000000000000", // Fallback UUID
          cover_image_url: "https://cdn.bilimtrack.com/blog/covers/" + (data.cover || "journal") + ".webp",
      });

      if (res.error || res.detail) {
        showToast("Ошибка сервера: " + (res.detail || "Неизвестная ошибка"), "bolt");
        return;
      }
      
      setStatus("published");
      await save();
      showToast(
        "Статья опубликована на /blog/" + (data.slug || "novaya-statya"),
        "check",
      );
    } catch (e) {
      console.error(e);
      showToast("Сетевая ошибка при публикации", "bolt");
    }
  }, [title, save, showToast, snapshot]);

  const preview = useCallback(async () => {
    await save();
    window.open(`/blog/${slug || PREVIEW_SLUG}`, "_blank");
  }, [save, slug]);

  const deleteDraft = useCallback(() => {
    localStorage.removeItem(DRAFT_KEY);
    showToast("Черновик удалён", "trash");
  }, [showToast]);

  useEffect(() => {
    const seedExample = () => {
      setCat("cases");
      setCover("journal");
      setTitle("Как МУИТ перешёл на цифровое управление учебным процессом");
      setExcerpt(
        "Рассказываем, как международный университет автоматизировал расписание, журнал и оплату — и за один семестр избавился от бумажной рутины.",
      );
      setInitialHtml(
        `<p>Когда набор вырос до полутора тысяч студентов, привычные таблицы перестали справляться.</p>`
      );
      setPubDate(todayISO());
    };

    const raw = typeof localStorage !== "undefined" && localStorage.getItem(DRAFT_KEY);
    if (raw) {
      try {
        const d = JSON.parse(raw) as Snapshot;
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
    preview,
    deleteDraft,
  };
}

export type ArticleEditorApi = ReturnType<typeof useArticleEditor>;
