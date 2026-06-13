# Bilimtrack Blog — передача проекта

Документ для разработчика, который продолжит работу. Описывает что это за проект,
как он устроен, что уже готово и что нужно доделать.

---

## 1. Что это за проект

**Bilimtrack** — образовательная SaaS-экосистема (разработчик: OurEra Soft) для
учебных организаций: школ, колледжей и вузов. Продукт закрывает расписание,
электронный журнал, онлайн-оплату и общение с родителями.

Этот репозиторий — **блог / knowledge-hub + посадочная воронка** для продукта.
Целевая аудитория — руководители учебных организаций (Кыргызстан / СНГ).
Контент (кейсы, советы, новости) служит верхом воронки и ведёт пользователя к
заявке на демо.

Контент на русском языке. В API заложен параметр `lang` (по умолчанию `ru`),
то есть мультиязычность предусмотрена, но в UI пока только русский.

---

## 2. Технологии

- **Next.js 16** (Pages Router, не App Router) + **React 19** + **TypeScript 5.6**
- **HeroUI v3** (UI-кит) + **Tailwind CSS v4** + **next-themes**
- **BlockNote** (`@blocknote/*`) — WYSIWYG-редактор для CMS
- Архитектура — **Feature-Sliced Design (FSD)**
- Алиас путей: `@/*` → `./src/*` (см. [tsconfig.json](tsconfig.json))

### Запуск

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # прод-сборка
npm run start    # запуск прод-сборки
npm run lint     # eslint --fix
```

Переменных окружения сейчас нет — базовый URL API зашит в коде (см. ниже).

---

## 3. Структура и маршруты

Роуты ([pages/](pages/)) — тонкие обёртки, вся логика в [src/](src/) по слоям FSD.

| Роут | Файл | Назначение |
|------|------|-----------|
| `/` | [pages/index.tsx](pages/index.tsx) | Редирект на `/blog` |
| `/blog` | [pages/blog/index.tsx](pages/blog/index.tsx) | Главная блога: hero, фильтр, поиск, лента, сайдбар |
| `/blog/[slug]` | [pages/blog/[slug].tsx](pages/blog/[slug].tsx) | Чтение статьи: TOC, шеринг, лид-магнит, CTA |
| `/writer/admin` | [pages/writer/admin.tsx](pages/writer/admin.tsx) | CMS-редактор статей (BlockNote), `noindex` |
| `/api/hello` | [pages/api/hello.ts](pages/api/hello.ts) | Заглушка из шаблона, можно удалить |

### Слои FSD ([src/](src/))

- **shared** — переиспользуемое: `ui` (Button, Icon), `lib` (cn, slugify, reading-time, plural), `config/site.ts` (метаданные сайта, навигация), **`api/blog-api.ts` (клиент API)**, `providers`, `styles` (CSS).
- **entities** — `article`, `category` (типы, мок-данные, карточки).
- **features** — `filter-articles` (лента+поиск), `share-article`, `subscribe-lead` (лид-магнит), `edit-article` (логика редактора).
- **widgets** — `site-header`, `site-footer`, `blog-hero`, `blog-sidebar`, `article-toc`, `article-content`, `final-cta`, `editor-nav`.
- **pages** (FSD-страницы) — `blog-home`, `article`, `writer-admin`.

---

## 4. ⚠️ Главное: состояние данных (mock vs API)

Это ключевой момент для передачи. Сайт **отрисовывается на захардкоженных
мок-данных**, а реальное API подключено лишь частично, поверх мока.

- Мок-контент: [src/entities/article/model/data.ts](src/entities/article/model/data.ts) (`ARTICLES`) и [src/entities/category/model/data.ts](src/entities/category/model/data.ts).
- `getStaticPaths` / `getStaticProps` для `/blog/[slug]` строятся **на моках**, не на API.
- Реальное API дёргается **на клиенте через `useEffect`** и перезаписывает мок, если в ответе есть `res.data`:
  - Лента: [useArticleFeed.ts](src/features/filter-articles/model/useArticleFeed.ts) → `blogApi.getArticles({ limit: 50 })`.
  - Статья: [ArticlePage.tsx](src/pages/article/ui/ArticlePage.tsx) → `blogApi.getArticle(slug)`.

**Следствия / проблемы:**
- SSR/SSG всегда отдаёт мок, реальные данные «мигают» поверх после загрузки клиента → плохо для SEO (а это блог, SEO критичен).
- Маппинг полей предполагает camelCase (`coverImageUrl`, `publishedAt`, `readingTime`) — нужно сверить с реальным ответом бэкенда.
- В `useArticleFeed` у `counts` пустой массив зависимостей `[]` — счётчики категорий считаются один раз по мок-данным (баг).
- Контент в самой статье ([ArticleBody.tsx](src/widgets/article-content/ui/ArticleBody.tsx)) при отсутствии `content` показывает **захардкоженный кейс МУИТ**. TOC, подзаголовок, «что вы узнаете», авторство в [ArticlePage.tsx](src/pages/article/ui/ArticlePage.tsx) тоже захардкожены под этот кейс, а не берутся из данных статьи.

---

## 5. CMS-редактор (`/writer/admin`)

UI редактора готов: BlockNote, автосохранение в `localStorage` (ключ `bt_draft`),
обложки, SEO-поля, подсчёт слов/времени чтения. Логика — в
[useArticleEditor.ts](src/features/edit-article/model/useArticleEditor.ts).

**Чего не хватает для реальной работы:**
- **Нет страницы логина.** Токен `cms_token` читается из `localStorage`, а при его отсутствии в `publish()` подставляется `"dummy_test_token"` — т.е. публикация в реальный бэкенд не пройдёт авторизацию.
- В `publish()` `category_id` подставляется нулевым UUID, `cover_image_url` собирается «на угад» из CDN-пути.
- Сохранение в API в `save()` **закомментировано** — пишется только `localStorage`.

---

## 6. Воронка (лид-магнит и демо)

- **Лид-магнит** ([LeadMagnet.tsx](src/features/subscribe-lead/ui/LeadMagnet.tsx)) — форма email в статье. Сейчас пишет только в `localStorage`, **в API не отправляет**.
- **Финальный CTA** ([FinalCta.tsx](src/widgets/final-cta/ui/FinalCta.tsx)) и кнопки «Получить демо» ведут на якоря `#demo` / `#` — **формы заявки на демо нет**.
- В API при этом **есть готовый метод** `blogApi.submitDemoRequest(...)` ([blog-api.ts](src/shared/api/blog-api.ts)) — его нужно подключить к форме.
- Ссылки в навигации (Возможности, Цены, Демо) — заглушки `#` ([site.ts](src/shared/config/site.ts)).

---

## 7. API

Клиент: [src/shared/api/blog-api.ts](src/shared/api/blog-api.ts).
База (захардкожена): `https://api.bilimtrack.com/api/v1`.

- `blogApi` — публичное: `getArticles`, `getArticle`, `getPopular`, `getCategories`, `getCategory`, `submitDemoRequest`.
- `cmsApi` — с `Authorization: Bearer <token>`: `login`, CRUD статей, `publishArticle`, `archiveArticle`, CRUD категорий, `getAuthors`, `getTags`, `getDemoRequests`, `updateDemoStatus`.

---

## 8. Что готово ✅

- Полный адаптивный UI/дизайн: главная блога, читалка статьи, CMS-редактор.
- FSD-архитектура, компоненты, стили, иконки.
- Мок-прототип контента (10 статей, 5 категорий).
- Слой клиента API (все функции описаны).
- Частичный клиентский фетч из API (поверх мока).
- BlockNote-редактор с автосохранением и экспортом в HTML.

## 9. Что нужно доделать (TODO)

1. **Сделать API источником правды** — перенести загрузку списка/статьи в `getStaticProps`/`getServerSideProps` (SSG/SSR ради SEO) вместо клиентского `useEffect`; сверить имена полей с бэкендом.
2. **Авторизация CMS** — страница логина, хранение/обновление `cms_token`, защита роута `/writer/admin`; убрать `dummy_test_token`.
3. **Доделать публикацию** — реальный выбор категории (грузить из `cmsApi.getCategories`), загрузка обложки, убрать нулевой UUID, включить сохранение в API (`save()`).
4. **Подключить воронку** — лид-магнит на endpoint подписки; формы «Получить демо» → `blogApi.submitDemoRequest`.
5. **Разъехать контент статьи с моком** — TOC, подзаголовок, «что вы узнаете», авторство брать из данных статьи, а не из кейса МУИТ.
6. **Env-конфиг** — вынести базовый URL API в `NEXT_PUBLIC_API_URL`, добавить `.env.example`.
7. **Починить баг** счётчиков категорий (зависимости `counts` в `useArticleFeed`).
8. **Обложки** — решить: реальные картинки вместо CSS-«сцен» (`CoverScene`) или оставить сцены.
9. **i18n** — параметр `lang` в API есть, UI пока только `ru`.
10. **Страницы категорий** — endpoint `getCategory` есть; фильтр `/blog?cat=` сейчас только клиентский, отдельного роута категории нет.
11. **Прочее** — тесты/CI отсутствуют; удалить заглушку [pages/api/hello.ts](pages/api/hello.ts); обновить корневой [README.md](README.md) (сейчас там дефолтный текст шаблона HeroUI).

---

## 10. Полезные точки входа в код

- Конфиг сайта / навигация — [src/shared/config/site.ts](src/shared/config/site.ts)
- Клиент API — [src/shared/api/blog-api.ts](src/shared/api/blog-api.ts)
- Мок-статьи — [src/entities/article/model/data.ts](src/entities/article/model/data.ts)
- Логика ленты/поиска — [src/features/filter-articles/model/useArticleFeed.ts](src/features/filter-articles/model/useArticleFeed.ts)
- Логика редактора — [src/features/edit-article/model/useArticleEditor.ts](src/features/edit-article/model/useArticleEditor.ts)
- Стили — [src/shared/styles/](src/shared/styles/)
