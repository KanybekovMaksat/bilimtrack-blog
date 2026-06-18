/**
 * Bilimtrack Blog — API client
 * Base: https://api.bilimtrack.com/api/v1
 *
 * All responses are wrapped in { data: ... } per the API spec.
 * CMS endpoints require Authorization: Bearer <token> (is_staff user).
 * Token is read from localStorage("cms_token") automatically by fetchWithAuth.
 */

const BASE = "https://api.bilimtrack.com/api/v1";

// ---------------------------------------------------------------------------
// Core fetch helper — reads token from localStorage, handles 401 + refresh
// ---------------------------------------------------------------------------
async function fetchWithAuth(url: string, options: RequestInit = {}): Promise<any> {
  // Guard: CMS API should only be called client-side (requires localStorage)
  if (typeof window === "undefined") return null;

  const token = localStorage.getItem("cms_token");

  const buildHeaders = (t: string | null): Record<string, string> => ({
    "Content-Type": "application/json",
    ...(t ? { Authorization: `Bearer ${t}` } : {}),
    ...((options.headers as Record<string, string> | undefined) ?? {}),
  });

  try {
    let res = await fetch(url, { ...options, headers: buildHeaders(token) });

    // Auto-refresh on 401
    if (res.status === 401) {
      const refresh = localStorage.getItem("cms_refresh_token");
      if (refresh) {
        try {
          const refreshRes = await fetch(`${BASE}/auth/refresh/`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ refresh }),
          });
          const refreshData = await refreshRes.json();
          const newAccess =
            refreshData?.data?.access ?? refreshData?.access ?? null;

          if (newAccess) {
            localStorage.setItem("cms_token", newAccess);
            res = await fetch(url, { ...options, headers: buildHeaders(newAccess) });
          } else {
            // Refresh token expired — clear session
            localStorage.removeItem("cms_token");
            localStorage.removeItem("cms_refresh_token");
          }
        } catch (err) {
          console.error("JWT refresh failed:", err);
        }
      }
    }

    // 204 No Content or empty body — return null instead of crashing on .json()
    if (res.status === 204) return null;
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  } catch (err) {
    // Network-level error (server unreachable, DNS failure, CORS, etc.)
    // Return null gracefully — callers already handle null responses.
    // Used console.warn instead of console.error to prevent Next.js
    // from showing the red error overlay during the mock demo.
    console.warn(`fetchWithAuth error [${url}]:`, err);
    return null;
  }
}



// ---------------------------------------------------------------------------
// Public API (no auth required)
// ---------------------------------------------------------------------------
/** Shape of the paginated list response from GET /blog/articles/ */
export interface ArticleListResponse {
  data: ArticleApiItem[];
  meta: {
    count: number;
    next: string | null;
    previous: string | null;
  };
}

/** Article object as returned by the public API */
export interface ArticleApiItem {
  slug: string;
  title: string;
  excerpt: string;
  coverImageUrl: string | null;
  publishedAt: string;
  readingTime: number;
  featured: boolean;
  category: { slug: string; name: string } | null;
  author: { id?: string; name: string; avatarUrl?: string } | null;
  relatedArticles?: ArticleApiItem[];
}

export const blogApi = {
  /**
   * GET /blog/articles/ — paginated list of published articles.
   *
   * Supported params (all optional):
   *   search   — full-text search by title and excerpt (server-side)
   *   featured — when "true" returns only featured articles
   *   category — category slug filter
   *   lang     — language code (default "ru")
   *   page     — 1-based page number
   *   pageSize — number of items per page
   *
   * Response: { data: ArticleApiItem[], meta: { count, next, previous } }
   */
  getArticles: (params: {
    lang?: string;
    category?: string;
    featured?: boolean;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<ArticleListResponse> => {
    const query: Record<string, string> = {};
    if (params.lang)      query.lang      = params.lang;
    if (params.category)  query.category  = params.category;
    if (params.search)    query.search    = params.search;
    if (params.featured)  query.featured  = "true";
    if (params.page)      query.page      = String(params.page);
    if (params.pageSize)  query.pageSize  = String(params.pageSize);
    return fetch(
      `${BASE}/blog/articles/?${new URLSearchParams(query)}`
    ).then((r) => r.json());
  },

  /** GET /blog/articles/:slug/ — full article by slug */
  getArticle: (slug: string, lang = "ru") =>
    fetch(`${BASE}/blog/articles/${slug}/?lang=${lang}`).then((r) => r.json()),

  /** GET /blog/articles/popular/ — top-5 by views */
  getPopular: (lang = "ru") =>
    fetch(`${BASE}/blog/articles/popular/?lang=${lang}`).then((r) => r.json()),

  /** GET /blog/categories/ */
  getCategories: (lang = "ru") =>
    fetch(`${BASE}/blog/categories/?lang=${lang}`).then((r) => r.json()),

  /** GET /blog/categories/:slug/ */
  getCategory: (
    slug: string,
    params: { lang?: string; page?: number; limit?: number }
  ) =>
    fetch(
      `${BASE}/blog/categories/${slug}/?${new URLSearchParams(params as Record<string, string>)}`
    ).then((r) => r.json()),

  /** POST /blog/demo-requests/ */
  submitDemoRequest: (body: {
    name: string;
    contact: string;
    organization: string;
    orgType: string;
    studentsCount: string;
    source?: string;
    sourceArticle?: string;
  }) =>
    fetch(`${BASE}/blog/demo-requests/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),
};

// ---------------------------------------------------------------------------
// CMS API (requires is_staff JWT token)
// ---------------------------------------------------------------------------
export const cmsApi = {
  /** POST /auth/login/ → { data: { access, refresh } } */
  login: (body: { username: string; password: string }) =>
    fetch(`${BASE}/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).then((r) => r.json()),

  /** GET /users/me/ — pass token explicitly (used right after login before localStorage is set) */
  getUserMe: (token: string) =>
    fetch(`${BASE}/users/me/`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    }).then((r) => r.json()),

  /** POST /auth/refresh/ */
  refreshToken: (refresh: string) =>
    fetch(`${BASE}/auth/refresh/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    }).then((r) => r.json()),

  /** POST /auth/logout/ */
  logout: (refresh: string) =>
    fetch(`${BASE}/auth/logout/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refresh }),
    }).then((r) => r.json()),

  // --- Articles CRUD ---

  /** GET /cms/articles/ — all articles incl. drafts */
  getArticles: () => fetchWithAuth(`${BASE}/cms/articles/`),

  /** GET /cms/articles/:id/ */
  getArticle: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/articles/${id}/`),

  /**
   * POST /cms/articles/
   * Body fields: titleRu, excerptRu, contentRu, category (UUID), author (UUID),
   *   slug, status, publishedAt (ISO 8601), coverImageUrl, seoTitleRu, seoDescriptionRu
   */
  createArticle: (_token: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/articles/`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /**
   * PATCH /cms/articles/:id/
   * Accepts same fields as createArticle (all optional for partial update).
   */
  updateArticle: (_token: string, id: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/articles/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** DELETE /cms/articles/:id/ */
  deleteArticle: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/articles/${id}/`, { method: "DELETE" }),

  /** POST /cms/articles/:id/publish/ */
  publishArticle: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/articles/${id}/publish/`, { method: "POST" }),

  /** POST /cms/articles/:id/archive/ */
  archiveArticle: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/articles/${id}/archive/`, { method: "POST" }),

  /**
   * POST /cms/media/upload/ — upload a cover image.
   *
   * TODO: Заменить на реальный API когда бэкенд будет готов.
   *       Эндпоинт: POST ${BASE}/cms/media/upload/
   *       Тело: FormData { file: File }
   *       Ответ: { data: { url: string } }
   *
   * 🚧 MOCK — имитирует задержку сети и возвращает локальный Object URL.
   *    Object URL живёт только в текущей вкладке браузера (не сохраняется).
   */
  uploadCoverImage: async (_token: string, file: File): Promise<{ url: string } | null> => {
    if (typeof window === "undefined") return null;

    // Simulate ~1 second network round-trip
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Create a temporary browser-local URL for the file — works without a server
    const url = URL.createObjectURL(file);
    return { url };
  },


  // --- Categories CRUD ---

  /** GET /cms/categories/ */
  getCategories: (_token?: string) => fetchWithAuth(`${BASE}/cms/categories/`),

  /** GET /cms/categories/:id/ */
  getCategory: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/categories/${id}/`),

  /** POST /cms/categories/ */
  createCategory: (_token: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/categories/`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** PATCH /cms/categories/:id/ */
  updateCategory: (_token: string, id: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/categories/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** DELETE /cms/categories/:id/ */
  deleteCategory: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/categories/${id}/`, { method: "DELETE" }),

  // --- Authors CRUD ---

  /** GET /cms/authors/ */
  getAuthors: (_token?: string) => fetchWithAuth(`${BASE}/cms/authors/`),

  /** POST /cms/authors/ */
  createAuthor: (_token: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/authors/`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** GET /cms/authors/:id/ */
  getAuthor: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/authors/${id}/`),

  /** PATCH /cms/authors/:id/ */
  updateAuthor: (_token: string, id: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/authors/${id}/`, {
      method: "PATCH",
      body: JSON.stringify(body),
    }),

  /** DELETE /cms/authors/:id/ */
  deleteAuthor: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/authors/${id}/`, { method: "DELETE" }),

  // --- Tags CRUD ---

  /** GET /cms/tags/ */
  getTags: (_token?: string) => fetchWithAuth(`${BASE}/cms/tags/`),

  /** POST /cms/tags/ */
  createTag: (_token: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/tags/`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** DELETE /cms/tags/:id/ */
  deleteTag: (_token: string, id: string) =>
    fetchWithAuth(`${BASE}/cms/tags/${id}/`, { method: "DELETE" }),

  // --- Demo requests ---

  /** GET /cms/demo-requests/?status=... */
  getDemoRequests: (_token: string, status?: string) =>
    fetchWithAuth(
      `${BASE}/cms/demo-requests/${status ? `?status=${status}` : ""}`
    ),

  /** PATCH /cms/demo-requests/:id/ */
  updateDemoStatus: (_token: string, id: string, status: string) =>
    fetchWithAuth(`${BASE}/cms/demo-requests/${id}/`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};
