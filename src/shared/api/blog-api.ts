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
}


// ---------------------------------------------------------------------------
// Public API (no auth required)
// ---------------------------------------------------------------------------
export const blogApi = {
  /** GET /blog/articles/ — list of published articles */
  getArticles: (params: {
    lang?: string;
    category?: string;
    page?: number;
    limit?: number;
  }) =>
    fetch(
      `${BASE}/blog/articles/?${new URLSearchParams(params as Record<string, string>)}`
    ).then((r) => r.json()),

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

  /** POST /cms/articles/
   *  Body per spec: titleRu, excerptRu, contentRu, category (UUID), author (UUID),
   *  slug, status, coverImageUrl, seoTitleRu, seoDescriptionRu
   */
  createArticle: (_token: string, body: object) =>
    fetchWithAuth(`${BASE}/cms/articles/`, {
      method: "POST",
      body: JSON.stringify(body),
    }),

  /** PATCH /cms/articles/:id/ */
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
