const BASE = 'https://api.bilimtrack.com/api/v1';

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' };
}

export const blogApi = {
  getArticles: (params: { lang?: string; category?: string; page?: number; limit?: number }) =>
    fetch(`${BASE}/blog/articles/?${new URLSearchParams(params as any)}`).then((res) => res.json()),

  getArticle: (slug: string, lang = 'ru') =>
    fetch(`${BASE}/blog/articles/${slug}/?lang=${lang}`).then((res) => res.json()),

  getPopular: (lang = 'ru') =>
    fetch(`${BASE}/blog/articles/popular/?lang=${lang}`).then((res) => res.json()),

  getCategories: (lang = 'ru') =>
    fetch(`${BASE}/blog/categories/?lang=${lang}`).then((res) => res.json()),

  getCategory: (slug: string, params: { lang?: string; page?: number; limit?: number }) =>
    fetch(`${BASE}/blog/categories/${slug}/?${new URLSearchParams(params as any)}`).then((res) => res.json()),

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
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => res.json()),
};

export const cmsApi = {
  login: (body: any) =>
    fetch(`${BASE}/auth/login/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  getArticles: (token: string) =>
    fetch(`${BASE}/cms/articles/`, { headers: authHeaders(token) }).then((res) => res.json()),

  getArticle: (token: string, id: string) =>
    fetch(`${BASE}/cms/articles/${id}/`, { headers: authHeaders(token) }).then((res) => res.json()),

  createArticle: (token: string, body: object) =>
    fetch(`${BASE}/cms/articles/`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  updateArticle: (token: string, id: string, body: object) =>
    fetch(`${BASE}/cms/articles/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  publishArticle: (token: string, id: string) =>
    fetch(`${BASE}/cms/articles/${id}/publish/`, {
      method: 'POST',
      headers: authHeaders(token),
    }).then((res) => res.json()),

  archiveArticle: (token: string, id: string) =>
    fetch(`${BASE}/cms/articles/${id}/archive/`, {
      method: 'POST',
      headers: authHeaders(token),
    }).then((res) => res.json()),

  getCategories: (token: string) =>
    fetch(`${BASE}/cms/categories/`, { headers: authHeaders(token) }).then((res) => res.json()),

  createCategory: (token: string, body: object) =>
    fetch(`${BASE}/cms/categories/`, {
      method: 'POST',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  updateCategory: (token: string, id: string, body: object) =>
    fetch(`${BASE}/cms/categories/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify(body),
    }).then((res) => res.json()),

  deleteCategory: (token: string, id: string) =>
    fetch(`${BASE}/cms/categories/${id}/`, {
      method: 'DELETE',
      headers: authHeaders(token),
    }).then((res) => res.json()),

  getAuthors: (token: string) =>
    fetch(`${BASE}/cms/authors/`, { headers: authHeaders(token) }).then((res) => res.json()),

  getTags: (token: string) =>
    fetch(`${BASE}/cms/tags/`, { headers: authHeaders(token) }).then((res) => res.json()),

  getDemoRequests: (token: string, status?: string) =>
    fetch(`${BASE}/cms/demo-requests/${status ? `?status=${status}` : ''}`, {
      headers: authHeaders(token),
    }).then((res) => res.json()),

  updateDemoStatus: (token: string, id: string, status: string) =>
    fetch(`${BASE}/cms/demo-requests/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    }).then((res) => res.json()),
};
