# Frontend API Guide — Блог bilimtrack.com/blog

> Дата: 2026-06-04  
> Base URL: `/api/v1`  
> Аутентификация публичных эндпоинтов: **не требуется**.  
> Аутентификация CMS: Bearer JWT (`Authorization: Bearer <token>`), пользователь с флагом `is_staff`.

---

## Содержание

1. [Общие соглашения](#1-общие-соглашения)
2. [Публичные эндпоинты](#2-публичные-эндпоинты)
   - [Список статей](#21-get-blogarticles)
   - [Детальная статья](#22-get-blogarticlesslug)
   - [Популярные статьи](#23-get-blogarticlespopular)
   - [Список категорий](#24-get-blogcategories)
   - [Категория со статьями](#25-get-blogcategoriesslug)
   - [Заявка на демо](#26-post-blogdemo-requests)
   - [XML Sitemap](#27-get-blogsitemapxml)
3. [CMS эндпоинты](#3-cms-эндпоинты)
   - [Авторизация](#31-авторизация)
   - [Статьи CRUD](#32-cms-статьи)
   - [Категории CRUD](#33-cms-категории)
   - [Авторы CRUD](#34-cms-авторы)
   - [Теги CRUD](#35-cms-теги)
   - [Заявки на демо](#36-cms-заявки-на-демо)

---

## 1. Общие соглашения

### Формат ответов

Все ответы оборачиваются в `data`:

```json
{ "data": { ... } }          // detail
{ "data": [...], "meta": { "count": 24, "next": "...", "previous": null } }  // list
```

### Именование полей

Все поля в **camelCase** — преобразование snake_case ↔ camelCase происходит автоматически на уровне middleware.

```
cover_image_url  →  coverImageUrl
reading_time     →  readingTime
published_at     →  publishedAt
org_type         →  orgType
students_count   →  studentsCount
```

### Параметр `lang`

Публичные эндпоинты поддерживают параметр `lang` (ru / ky / en, по умолчанию `ru`).  
При указанном языке поля `title`, `excerpt`, `content`, `name`, `description` возвращаются для этого языка.  
Если перевод пуст — возвращается значение на русском языке.

```
GET /api/v1/blog/articles/?lang=ky
```

### Ошибки валидации `400`

```json
{
  "type": "validation_error",
  "errors": [
    { "code": "required", "detail": "This field is required.", "attr": "name" }
  ]
}
```

---

## 2. Публичные эндпоинты

### 2.1 `GET /blog/articles/`

Список опубликованных статей с пагинацией.

**Query-параметры:**

| Параметр | Тип | Описание |
|----------|-----|----------|
| `lang` | string | `ru` / `ky` / `en` (default: `ru`) |
| `category` | string | Slug категории |
| `page` | integer | Страница (default: 1) |
| `limit` | integer | Записей на странице (default: 12, max: 50) |

**Ответ `200`:**

```json
{
  "data": [
    {
      "id": "550e8400-e29b-41d4-a716-446655440000",
      "title": "Как МУИТ перешёл на цифровое управление",
      "slug": "muit-tsifrovoe-upravlenie",
      "excerpt": "Краткое описание статьи...",
      "coverImageUrl": "https://cdn.bilimtrack.com/blog/covers/article.webp",
      "readingTime": 8,
      "publishedAt": "2025-01-15T10:00:00Z",
      "category": {
        "id": "...",
        "name": "Кейсы",
        "slug": "cases"
      },
      "author": {
        "id": "...",
        "name": "Команда Bilimtrack",
        "avatarUrl": "https://..."
      }
    }
  ],
  "meta": {
    "count": 24,
    "next": "/api/v1/blog/articles/?page=2",
    "previous": null
  }
}
```

---

### 2.2 `GET /blog/articles/:slug/`

Полная статья по slug. При каждом запросе увеличивается счётчик `viewsCount` — дедупликация по IP в окне 24 часа.

**Query-параметры:** `lang`

**Ответ `200`:**

```json
{
  "data": {
    "id": "550e8400-...",
    "title": "Как МУИТ перешёл на цифровое управление",
    "slug": "muit-tsifrovoe-upravlenie",
    "excerpt": "Краткое описание...",
    "content": "<h2>Введение</h2><p>...</p>",
    "coverImageUrl": "https://...",
    "readingTime": 8,
    "publishedAt": "2025-01-15T10:00:00Z",
    "viewsCount": 142,
    "seo": {
      "title": "SEO заголовок",
      "description": "SEO описание"
    },
    "category": { "id": "...", "name": "Кейсы", "slug": "cases" },
    "author": { "id": "...", "name": "Команда Bilimtrack", "avatarUrl": "..." },
    "tags": [
      { "id": "...", "name": "Кейс", "slug": "case" }
    ],
    "relatedArticles": [
      {
        "id": "...",
        "title": "...",
        "slug": "...",
        "coverImageUrl": "...",
        "readingTime": 5,
        "category": { "name": "...", "slug": "..." }
      }
    ]
  }
}
```

**Ответ `404`:**

```json
{ "detail": "Not found." }
```

---

### 2.3 `GET /blog/articles/popular/`

Топ-5 статей по `viewsCount` за последние 30 дней.

> ⚠️ URL `/blog/articles/popular/` должен объявляться в роутере **до** `/blog/articles/:slug/`, иначе `popular` будет обработан как slug.

**Query-параметры:** `lang`

**Ответ `200`:**

```json
{
  "data": [ /* массив ArticlePreview */ ]
}
```

---

### 2.4 `GET /blog/categories/`

Список категорий с количеством опубликованных статей.

**Query-параметры:** `lang`

**Ответ `200`:**

```json
{
  "data": [
    {
      "id": "...",
      "name": "Кейсы",
      "slug": "cases",
      "articlesCount": 4
    }
  ],
  "meta": { "count": 5, "next": null, "previous": null }
}
```

---

### 2.5 `GET /blog/categories/:slug/`

Категория + список статей в ней.

**Query-параметры:** `lang`, `page`, `limit`

**Ответ `200`:**

```json
{
  "data": {
    "category": { "id": "...", "name": "Кейсы", "slug": "cases" },
    "data": [ /* массив ArticlePreview */ ],
    "meta": {
      "total": 12,
      "page": 1,
      "limit": 12,
      "totalPages": 1
    }
  }
}
```

**Ответ `404`:**

```json
{ "data": { "error": "Category not found" } }
```

---

### 2.6 `POST /blog/demo-requests/`

Отправка заявки на демо с блога. После сохранения уведомление отправляется в Telegram.

**Rate limiting:** максимум 5 запросов с одного IP в час.

**Тело запроса:**

```json
{
  "name": "Айгуль Матанова",
  "contact": "aigul@school.kg",
  "organization": "Школа №15",
  "orgType": "school",
  "studentsCount": "100_300",
  "source": "blog",
  "sourceArticle": "550e8400-e29b-41d4-a716-446655440000"
}
```

| Поле | Тип | Обяз. | Описание |
|------|-----|:-----:|---------|
| `name` | string | ✓ | 2–100 символов |
| `contact` | string | ✓ | Email или телефон (`+996...`) |
| `organization` | string | ✓ | 2–200 символов |
| `orgType` | string | ✓ | `school` / `college` / `university` / `other` |
| `studentsCount` | string | ✓ | `lt100` / `100_300` / `300_1000` / `gt1000` |
| `source` | string | | `blog` / `landing` / `direct` |
| `sourceArticle` | UUID | | ID статьи, с которой пришёл пользователь |

**Ответ `201`:**

```json
{
  "data": { "message": "Заявка принята. Мы свяжемся с вами в течение 2 часов." }
}
```

**Ответ `429` (rate limit):**

```json
{
  "data": { "error": "Слишком много заявок. Попробуйте позже." }
}
```

**Ошибки валидации `400`:**

```json
{
  "type": "validation_error",
  "errors": [
    { "code": "invalid_choice", "detail": "...", "attr": "orgType" },
    { "code": "invalid", "detail": "Введите корректный email или номер телефона (+996...).", "attr": "contact" }
  ]
}
```

| `attr` | Поле формы |
|--------|-----------|
| `name` | Имя |
| `contact` | Телефон или email |
| `organization` | Организация |
| `orgType` | Тип организации |
| `studentsCount` | Количество учащихся |

---

### 2.7 `GET /blog/sitemap.xml`

XML Sitemap всех опубликованных статей. Кэшируется на 1 час.

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://bilimtrack.com/blog/muit-tsifrovoe-upravlenie</loc>
    <lastmod>2025-01-15</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

---

## 3. CMS эндпоинты

> Все CMS эндпоинты требуют `Authorization: Bearer <access_token>`.  
> Пользователь должен иметь флаг `is_staff = true` в Django.

### 3.1 Авторизация

Используется тот же JWT-эндпоинт что и для SIS-приложения:

```
POST /api/v1/auth/login/
```

```json
{ "username": "admin@bilimtrack.com", "password": "..." }
```

```json
{ "data": { "access": "eyJ...", "refresh": "eyJ..." } }
```

Передавать в заголовке:

```
Authorization: Bearer eyJ...
```

---

### 3.2 CMS Статьи

| Метод | URL | Описание |
|-------|-----|---------|
| `GET` | `/cms/articles/` | Список всех статей (включая черновики) |
| `GET` | `/cms/articles/:id/` | Одна статья |
| `POST` | `/cms/articles/` | Создать статью |
| `PATCH` | `/cms/articles/:id/` | Обновить статью |
| `DELETE` | `/cms/articles/:id/` | Удалить статью |
| `POST` | `/cms/articles/:id/publish/` | Опубликовать |
| `POST` | `/cms/articles/:id/archive/` | Архивировать |

**Тело `POST /cms/articles/`:**

```json
{
  "titleRu": "Заголовок на русском",
  "titleKy": "...",
  "titleEn": "...",
  "slug": "zagolok-na-russkom",
  "excerptRu": "Краткое описание...",
  "contentRu": "<h2>Текст статьи...</h2>",
  "coverImageUrl": "https://...",
  "status": "draft",
  "category": "uuid-категории",
  "author": "uuid-автора",
  "tags": ["uuid-тега-1", "uuid-тега-2"],
  "seoTitleRu": "...",
  "seoDescriptionRu": "..."
}
```

> `slug` — опциональный. Если не передан, генерируется автоматически из `titleRu` с транслитерацией.  
> `readingTime` — рассчитывается автоматически по `contentRu` (200 слов/мин), передавать не нужно.

**Ответ `201` / `200`:** полный объект статьи со всеми языковыми полями.

**Статусы:**

| Значение | Описание |
|----------|---------|
| `draft` | Черновик — не виден в публичном API |
| `published` | Опубликована — доступна всем |
| `archived` | Архив — не виден в публичном API |

---

### 3.3 CMS Категории

| Метод | URL | Описание |
|-------|-----|---------|
| `GET` | `/cms/categories/` | Список |
| `POST` | `/cms/categories/` | Создать |
| `PATCH` | `/cms/categories/:id/` | Обновить |
| `DELETE` | `/cms/categories/:id/` | Удалить |

> `DELETE` вернёт `400` если к категории привязаны статьи.

```json
{
  "nameRu": "Кейсы",
  "nameKy": "...",
  "nameEn": "Cases",
  "slug": "cases",
  "descriptionRu": "..."
}
```

---

### 3.4 CMS Авторы

| Метод | URL |
|-------|-----|
| `GET` | `/cms/authors/` |
| `POST` | `/cms/authors/` |
| `PATCH` | `/cms/authors/:id/` |
| `DELETE` | `/cms/authors/:id/` |

```json
{
  "name": "Команда Bilimtrack",
  "bioRu": "...",
  "bioEn": "...",
  "avatarUrl": "https://..."
}
```

---

### 3.5 CMS Теги

| Метод | URL |
|-------|-----|
| `GET` | `/cms/tags/` |
| `POST` | `/cms/tags/` |
| `DELETE` | `/cms/tags/:id/` |

```json
{ "nameRu": "Кейс", "nameEn": "Case Study", "slug": "case-study" }
```

---

### 3.6 CMS Заявки на демо

| Метод | URL | Описание |
|-------|-----|---------|
| `GET` | `/cms/demo-requests/` | Список с фильтром по статусу |
| `PATCH` | `/cms/demo-requests/:id/` | Обновить статус |

**Query-параметры `GET`:** `status` (`new` / `contacted` / `demo_scheduled` / `closed`), `page`

**Ответ `200`:**

```json
{
  "data": [
    {
      "id": "...",
      "name": "Айгуль Матанова",
      "contact": "aigul@school.kg",
      "organization": "Школа №15",
      "orgType": "school",
      "studentsCount": "100_300",
      "source": "blog",
      "sourceArticle": "uuid-статьи",
      "sourceArticleTitle": "Как МУИТ перешёл...",
      "status": "new",
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": { "count": 12, "next": null, "previous": null }
}
```

**`PATCH /cms/demo-requests/:id/`:**

```json
{ "status": "contacted" }
```

---

## Пример реализации (TypeScript)

```ts
// lib/blog-api.ts

const BASE = '/api/v1'

function authHeaders(token: string) {
  return { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }
}

// Публичные
export const blogApi = {
  getArticles: (params: { lang?: string; category?: string; page?: number }) =>
    fetch(`${BASE}/blog/articles/?${new URLSearchParams(params as Record<string, string>)}`),

  getArticle: (slug: string, lang = 'ru') =>
    fetch(`${BASE}/blog/articles/${slug}/?lang=${lang}`),

  getPopular: (lang = 'ru') =>
    fetch(`${BASE}/blog/articles/popular/?lang=${lang}`),

  getCategories: (lang = 'ru') =>
    fetch(`${BASE}/blog/categories/?lang=${lang}`),

  getCategory: (slug: string, params: { lang?: string; page?: number }) =>
    fetch(`${BASE}/blog/categories/${slug}/?${new URLSearchParams(params as Record<string, string>)}`),

  submitDemoRequest: (body: {
    name: string
    contact: string
    organization: string
    orgType: string
    studentsCount: string
    source?: string
    sourceArticle?: string
  }) =>
    fetch(`${BASE}/blog/demo-requests/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    }),
}

// CMS
export const cmsApi = {
  getArticles: (token: string) =>
    fetch(`${BASE}/cms/articles/`, { headers: authHeaders(token) }),

  createArticle: (token: string, body: object) =>
    fetch(`${BASE}/cms/articles/`, { method: 'POST', headers: authHeaders(token), body: JSON.stringify(body) }),

  updateArticle: (token: string, id: string, body: object) =>
    fetch(`${BASE}/cms/articles/${id}/`, { method: 'PATCH', headers: authHeaders(token), body: JSON.stringify(body) }),

  publishArticle: (token: string, id: string) =>
    fetch(`${BASE}/cms/articles/${id}/publish/`, { method: 'POST', headers: authHeaders(token) }),

  archiveArticle: (token: string, id: string) =>
    fetch(`${BASE}/cms/articles/${id}/archive/`, { method: 'POST', headers: authHeaders(token) }),

  getDemoRequests: (token: string, status?: string) =>
    fetch(`${BASE}/cms/demo-requests/${status ? `?status=${status}` : ''}`, { headers: authHeaders(token) }),

  updateDemoStatus: (token: string, id: string, status: string) =>
    fetch(`${BASE}/cms/demo-requests/${id}/`, {
      method: 'PATCH',
      headers: authHeaders(token),
      body: JSON.stringify({ status }),
    }),
}
```

---

## Значения choice-полей

### `orgType`

| Значение | Метка |
|----------|-------|
| `school` | Школа |
| `college` | Колледж |
| `university` | Университет |
| `other` | Другое |

### `studentsCount`

| Значение | Метка |
|----------|-------|
| `lt100` | до 100 |
| `100_300` | 100–300 |
| `300_1000` | 300–1000 |
| `gt1000` | свыше 1000 |

### `status` (заявки)

| Значение | Метка |
|----------|-------|
| `new` | Новая |
| `contacted` | На связи |
| `demo_scheduled` | Демо назначено |
| `closed` | Закрыта |

### `status` (статьи)

| Значение | Описание |
|----------|---------|
| `draft` | Черновик |
| `published` | Опубликована |
| `archived` | Архив |
