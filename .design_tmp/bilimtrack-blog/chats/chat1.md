# Russian Blog Design

_Started 2026-06-03 12:54 UTC_

---

## User

<system-info comment="Only acknowledge these if relevant">
Project title is now "Bilimtrack Blog"
Project is currently empty (no files)
Current date is now June 3, 2026
</system-info>

<pasted_text name="Pasted text (203 lines)">
ТЗ: Блог bilimtrack.com/blog
Design Specification v1.0

1. Цель блога
Блог решает две задачи одновременно:
SEO — статьи привлекают органический трафик от директоров и администраторов которые ищут решения в Google.
Прогрев — читатель приходит за полезным контентом, видит что Bilimtrack разбирается в теме, и оставляет заявку.
Каждая статья заканчивается CTA на демо.

2. Страницы для дизайна
1. Главная блога (/blog)
2. Страница статьи (/blog/slug)
3. Страница категории (/blog/category/slug)

3. Главная блога — /blog
3.1 Хедер страницы
Стандартный хедер сайта (навигация Bilimtrack).
Под навигацией — заголовок раздела:
[H1] Блог Bilimtrack
[Подзаголовок] Практические материалы для руководителей
               учебных организаций

3.2 Фильтр по категориям
Горизонтальная строка тегов-кнопок:
[Все]  [Управление школой]  [Кейсы]  [Советы директору]  [Новости]
Активная категория визуально выделена.
При клике — фильтрует карточки без перезагрузки страницы.

3.3 Главная статья (hero-пост)
Первая и самая свежая статья — крупная карточка на всю ширину:
┌──────────────────────────────────────────────────────┐
│                                                      │
│   [Обложка статьи — изображение на весь блок]        │
│                                                      │
│   [Категория-тег]  Кейсы                             │
│                                                      │
│   [H2] Как МУИТ перешёл на цифровое                  │
│        управление учебным процессом                  │
│                                                      │
│   [Дата]  15 января 2025  ·  8 мин чтения            │
│                                                      │
│   [Краткое описание — 2 строки]                      │
│   Рассказываем как международный университет         │
│   автоматизировал расписание, журнал и оплату...     │
│                                                      │
│   [Читать →]                                         │
└──────────────────────────────────────────────────────┘

3.4 Сетка статей
Под hero-постом — сетка карточек 3 в строку (на десктопе).
Карточка статьи:
┌───────────────────┐
│  [Обложка]        │
│                   │
├───────────────────┤
│ [Категория-тег]   │
│                   │
│ [Заголовок]       │
│ до 2 строк        │
│                   │
│ [Дата] · [N мин]  │
└───────────────────┘
Пагинация внизу: загрузить ещё (lazy load) или стандартная пагинация.

3.5 Боковая панель (sidebar)
На десктопе — справа от сетки карточек.
На мобиле — уходит под сетку.
Блоки в сайдбаре:
CTA-блок:
┌─────────────────────┐
│ Хотите посмотреть   │
│ как это работает?   │
│                     │
│ [Получить демо →]   │
└─────────────────────┘
Популярные статьи:
Список 4-5 заголовков со ссылками.
Категории:
Список категорий с количеством статей.

4. Страница статьи — /blog/[slug]
4.1 Общий макет
Десктоп: контент (70%) + сайдбар (30%)
Мобиль: контент на всю ширину, сайдбар уходит вниз

4.2 Шапка статьи
[Хлебные крошки]
Блог → Кейсы → Как МУИТ перешёл на цифровое управление

[Категория-тег]
Кейсы

[H1 — заголовок статьи]
Как МУИТ перешёл на цифровое управление
учебным процессом

[Мета-строка]
[Аватар автора] Команда Bilimtrack  ·  15 января 2025  ·  8 мин чтения

[Обложка статьи — полная ширина контентной колонки]

4.3 Содержание (оглавление)
Если статья длиннее 5 минут чтения — показывать оглавление.
Содержание
──────────
1. Заголовок раздела
2. Заголовок раздела
3. Заголовок раздела
На десктопе — sticky в сайдбаре, подсвечивает активный раздел при скролле.
На мобиле — раскрывающийся блок под шапкой статьи.

4.4 Типографика контента
Все текстовые элементы статьи должны быть чётко стилизованы:
ЭлементОписаниеH2Заголовок раздела — крупный, с отступом сверхуH3Подзаголовок — меньше H2ПараграфЧитаемый размер, межстрочный интервал 1.7Цитата (blockquote)Левая граница акцентного цвета, курсивСписок (ul/ol)Аккуратные отступы, не слипаетсяИзображениеПолная ширина колонки, подпись под фотоТаблицаЧёткие границы, чередующийся фон строкКод (code)Моноширинный шрифт, серый фонCallout-блокВыделенный блок для важных заметок
Callout-блок пример:
┌─────────────────────────────────┐
│ 💡 Важно                        │
│ Текст важной заметки которую    │
│ читатель не должен пропустить   │
└─────────────────────────────────┘

4.5 Встроенный CTA внутри статьи
После каждого второго-третьего раздела — встроенный CTA-блок:
┌─────────────────────────────────────────────┐
│ Хотите посмотреть как это работает           │
│ в вашей организации?                         │
│                                             │
│ [Получить демо →]                            │
└─────────────────────────────────────────────┘
Ненавязчивый, не перекрывает текст, органично вписан.

4.6 Финальный CTA в конце статьи
После последнего абзаца — полноценный CTA-блок:
┌─────────────────────────────────────────────┐
│                                             │
│  Bilimtrack — всё что нужно для управления  │
│  учебной организацией в одной системе.      │
│                                             │
│  Первые 3 месяца бесплатно.                 │
│                                             │
│  [Получить демо →]  [Посмотреть цены]        │
│                                             │
└─────────────────────────────────────────────┘

4.7 Блок "Читать также"
Под финальным CTA — три карточки похожих статей:
Читать также
────────────
[Карточка]  [Карточка]  [Карточка]
Карточки: обложка + категория + заголовок + время чтения.

4.8 Сайдбар статьи
Sticky на десктопе. Содержит сверху вниз:

Оглавление — подсвечивает текущий раздел
CTA-блок — "Получить демо"
Поделиться — иконки: Telegram, WhatsApp, скопировать ссылку
Популярные статьи — 3-4 заголовка


4.9 Шаринг и соцсети
Под заголовком статьи (десктоп) или в конце (мобиль):
Поделиться: [Telegram]  [WhatsApp]  [Скопировать ссылку]

5. Страница категории — /blog/category/[slug]
Аналогична главной блога но:

H1 = название категории
Показываются только статьи этой категории
Краткое описание категории под заголовком

[H1] Кейсы
[Описание] Реальные истории внедрения Bilimtrack
           в учебных организациях Кыргызстана.

[Сетка карточек...]

6. Адаптивная версия (мобиль)
ЭлементДесктопМобильСетка карточек3 в строку1 в строкуHero-постГоризонтальныйВертикальныйСайдбарСправа stickyУходит под контентОглавлениеВ сайдбареАккордеон под шапкойФильтр категорийСтрока кнопокГоризонтальный скроллCTA в статьеВстроен в контентПолная ширинаШарингПод заголовкомВ конце статьи

7. Обложки статей
Единый стиль для всех обложек:

Соотношение сторон: 16:9
Текст заголовка на обложке — необязателен
Реальные скриншоты интерфейса > абстрактные иллюстрации
Для кейсов: логотип организации-клиента если есть разрешение


8. Технические требования

Статические страницы для скорости загрузки
OG-теги для корректного превью в Telegram и WhatsApp
Время чтения — считается автоматически (~200 слов/мин)
Изображения — формат WebP, ленивая загрузка
Канонические URL для избежания дублей
Sitemap обновляется автоматически при публикации


9. Метрики успеха блога
МетрикаЦельВремя на страницеболее 3 минутГлубина скроллаболее 60%CTR на CTA внутри статьиболее 2%Органический трафикрост каждый месяцЗаявки с блогахотя бы 1-2 в месяц через 6 месяцев

Bilimtrack — Blog Design Spec v1.0
</pasted_text>

<!-- The user explicitly selected the following skills for this project, as attachments to their message. These are not optional context — they define how you work. Use them. -->
<attached-skill name="Bilimtrack Design System (design system)">
[Design System] This project uses the **Bilimtrack Design System** design system. This is a binding choice for visual style — every visual must follow it. Don't invent colors, type, spacing, or components not grounded here.

Scope: the design system is a visual style reference only. Its guide may describe example products, brands, or people that are unrelated to the user and unrelated to the subject of this conversation. Never treat anything in the design system as a fact about the user, their work, or the topic they asked about.

    Explore it to find what you need:
    - Always copy out the fonts and colors you need
    - For prototypes and designs, always copy out any relevant components
    - If the design system contains existing mocks of products, and you were asked to design or prototype something similar, copy and fork those mocks to start your design. This helps you make high-quality designs.

    Explore it quickly to find relevant UI kits (e.g. mocks of existing products you can copy and fork)

Full system at `/projects/1305caee-8964-4089-ac71-f7642d1ddfed/`. Its guide is reproduced below so you don't need to fetch it:

<design-system-guide>
# Bilimtrack — Design System

**Bilimtrack** (рус. _«Билимтрак»_; from Kazakh **bilim** = "knowledge/education") is an **educational ecosystem** ("Образовательная экосистема") built by **OurEra Soft**. It is a school / college management platform for the CIS market (interface language is **Russian**), connecting three roles around a shared gradebook, schedule, chat and gamification layer.

The product greeting line is **"Bilimtrack — Образовательная экосистема"** and every login footer reads **"Разработано OurEra Soft"** ("Developed by OurEra Soft"). The brand mascot is a **cartoon panda in a blue hoodie** wearing the puzzle-piece logo.

## Products / surfaces

| Role | Surface | Canvas | What it is |
|------|---------|--------|------------|
| **Learner** (Ученик) | Mobile app | 390 px wide | Student app: diary/gradebook (**Дневник**), schedule (**Расписание**), chats, rating/leaderboard, profile, social feed (posts, Instagram/Telegram-style ID cards). Bottom tab bar. |
| **Mentor** (Преподаватель) | Desktop web | 1536 px | Teacher console: left sidebar nav (Главная, График работы, Журнал, Чаты, Новости, Архив, Профиль, Управление), schedule + journal grids. |
| **Mentor-Mobile** | Mobile app | 390 px | Teacher app, mobile form factor. |
| **Guardian** (Родитель) | Mobile app | 390 px | Parent app — monitors a child's grades &amp; schedule. |

The whole platform shares one component library (buttons, inputs, badges, grades, cards, avatars, gamification badges) across all surfaces — this design system documents it.

## Domain vocabulary (RU)
- **Дневник** — diary / gradebook · **Расписание** — schedule · **Журнал** — class journal
- **Дисциплина** — subject/course · **Модуль / Семестр / Курс** — module / semester / year
- **Числитель / Знаменатель** — numerator/denominator weeks (alternating timetable)
- **Практика / Лекция** — practical / lecture · **Управление** — administration

## Sources given
- **Figma:** "🧩 Bilimtrack (by OurEra Soft).fig" — mounted virtual FS. Pages used: `Typography`, `Icons`, `Learner` (101 frames), `Mentor` (46), `Mentor-Mobile` (18), `Guardian` (4), plus component pages `Button`, `Badge`, `Input`, `Grade`, `Cards`, `Avatar`, `Header`, `Separator`, `List`, `ToggleButton`, `Checkbox-Radio`, `RowMessage`.
- **Codebase:** `ui/` — the production React component library (Tailwind v4 + `class-variance-authority` + Radix primitives). This is the **source of truth** for tokens, variants and sizing. Key files: `typography.tsx`, `button.tsx`, `badge.tsx`, `grade.tsx`, `gamification-badge.tsx`, `input.tsx`, `field.tsx`, `icon-button.tsx`, `tab.tsx`, `user-avatar.tsx`, `progress-circle.tsx`.
- **Upload:** `uploads/logobilii.png` — the app-icon logo mark.

---

## CONTENT FUNDAMENTALS

**Language.** Russian, all UI. Short, functional, neutral-formal — closer to "system" voice than marketing. No exclamation marks in product chrome.

**Tone &amp; address.** Impersonal/neutral; instructions are infinitive or imperative ("Войти", "Я забыл пароль", "Нажимая кнопку войти вы принимаете…"). The platform speaks **to** the user with **вы** (formal you) but mostly avoids pronouns entirely — labels are nouns and verbs, not sentences.

**Casing.** Sentence case everywhere — **never** ALL-CAPS or Title Case for UI labels. Section titles, buttons and nav are sentence case ("График работы", "12 дисциплин"). The only uppercasing is single-letter grade marks (A/B/C/N) and weekday abbreviations (ПН, ВТ, СР…), which are set uppercase by the component.

**Numerals.** Heavy use of compact counts with units: "12 дисциплин", "12 занятий", "16 часов", "1 модуль · 1 семестр · 1 курс". Percentages with a tiny up/down caret + green/red ("1.7% ▲"). Time ranges as "08:00 – 09:20".

**Microcopy examples**
- Login: _Логин или номер телефона_ · _Пароль_ · _Войти_ · _Я забыл пароль_
- Legal: _Нажимая кнопку войти вы принимаете Пользовательское соглашение и Политика конфиденциальности_
- Tagline: _Образовательная экосистема_ · Footer: _Разработано OurEra Soft_
- Tabs: _Расписание_ / _Дневник_ · Filter chips: _Числитель_, _12 занятий_

**Emoji.** Not used in product chrome. Meaning is carried by **iconography and color**, not emoji. (The brand's playful side lives in the panda mascot, not in text.)

**Vibe.** Clean, bright, "Apple-meets-Material" school utility. Trustworthy and legible for students, teachers and parents alike; gamification (trophies/points/streaks) adds warmth without clutter.

---

## VISUAL FOUNDATIONS

**Overall.** Bright, white-first, high-legibility. Content sits on **white** (`--surface-lowest`) separated by hairline `#f5f5f5`/`#e5e5e5` borders and generous whitespace — **not** by heavy shadows. The single most-used color in the entire file is `#f5f5f5` (neutral-100), used for input fills, chips and hover surfaces.

**Color.**
- **Neutrals are the spine.** White → `#f5f5f5` fills → `#a1a1a1` subtle → `#737373` muted → `#0a0a0a`/black text. Dark surfaces use `#262626` (login, inverse).
- **Brand accent = blue.** Primary buttons are `#155dfc` (brand-600), lightening to `#2b7fff` on hover; brand text/links/active states are `#155dfc`. (Note: the bright purple `#8e51ff`/`#9747ff` seen in the .fig is **Figma annotation/markup**, *not* a brand color — do not use it as brand.)
- **Multicolor grade system** is the most distinctive visual signature — solid color circles for marks 5/4/3/2 (green/blue/purple/red) and pale-tinted chips for attendance letters A/B/C/N. See the Grade cards.
- **Gamification** uses **orange** (trophy/rating, `#ff8904` orange-400) and **blue** (bolt/points, `#155dfc`). **Streaks** use a gold→orange vertical gradient (`#ffba00 → #ff6900`) applied to both the flame fill and gradient-clipped text (`.streak-text`).
- Semantic: success `#00a63e`/`#00c951`, error `#fb2c36`, warning `#fd9a00`.
- **Dark mode** is fully themed (`.dark`): surfaces become `#262626`/`#171717`, primary lightens to brand-500, text inverts. The desktop **login screen ships in dark**. There is also a premium warm **gradient stroke** (`#feac5e → #c779d0`, orange→purple) for special image/avatar edges, and a cyan focus ring (`stroke-focus`).

**Typography.** **TikTok Sans** is the UI typeface (300–800; mostly Regular 400 &amp; Medium 500, SemiBold 600 for callouts, occasional Bold 700 for grade digits &amp; big numbers). **Inter** is a secondary face used in places for numerics. A display face **"EFour Digital Pro"** appears rarely (≈9×) for oversized timer/score numerals — *substituted here with Orbitron* (see FLAG). The scale is small and tight: body is 14px, captions 12px, tiny labels 10px, screen titles 20px/600. Line-heights are compact (18px on 14px text).

**Shape &amp; radii.** Pills everywhere. Buttons, inputs, chips, badges, tabs, grade marks and avatars(max) are **fully rounded** (`9999px`). Cards &amp; sheets use large soft radii **16–24px**. Avatars have a "default" radius set that scales with size (6 → 8 → 10 → 12 → 16px) plus a "max" fully-round option.

**Borders.** Hairline, 1px. `#f5f5f5` for quiet dividers, `#e5e5e5` for visible separators/outline buttons. Inputs are bordered pills that switch to a darker `#404040` border on focus (`focus-within`), or red `#fb2c36` on error. Outline buttons/badges use the `#e5e5e5` border.

**Elevation / shadows.** Used sparingly. Cards mostly rely on borders, not shadow. The **toggle button** is the notable elevated element: `0 0 8px 0 rgba(230,232,235,.9)` soft ambient glow. Popovers/menus get a soft drop `0 8px 24px -6px rgba(0,0,0,.12)`. Avatars carry an **inset** `inset 0 0 0 1px rgba(255,255,255,.4)` ring for crispness on photos. No neumorphism, no hard drop shadows.

**Backgrounds &amp; imagery.** App backgrounds are flat white (or `#262626` dark on the desktop login). No gradient-mesh backgrounds. Brand imagery is **hand-drawn / illustrated**: the panda mascot (login hero, set on a diagonal `matrix()` rotation behind the form) and warm "lofi study scene" banner art (`1920×640` cover photos, profile covers). Imagery is **warm and characterful** against the cool/neutral UI. Default avatar is a panda-eared gray silhouette.

**Iconography color.** Icons inherit text color — `#0a0a0a` primary, `#a1a1a1` muted (inactive tabs/decorative), `#155dfc` brand, semantic colors when meaningful. Stroke icons at ~1.75–2px weight.

**Motion.** Restrained. `transition-all`/`transition-colors` on interactive elements (buttons, inputs, tabs). No bounce, no elaborate keyframe choreography in the component layer — fades and color/opacity transitions only. Progress ring animates its stroke offset over ~300ms.

**Interaction states.**
- *Hover:* fill darkens one step (primary `#2b7fff`→`#155dfc`; secondary `#f5f5f5`→`#e5e5e5`; ghost-muted text goes muted→primary).
- *Focus:* 3px brand ring on buttons; border darkens to `#404040` on inputs.
- *Disabled:* `opacity: .5`, no pointer events.
- *Active/selected:* color shift (muted→primary text + brand accent), e.g. tabs, grade pills, sidebar items get a light `#f5f5f5`/white highlight.
- *Press:* color change rather than scale-shrink.

**Layout rules.** Mobile canvas is **390px** with a fixed top header (status bar + title + search/filter) and a fixed bottom tab bar; content scrolls between. Desktop Mentor is a fixed **white left sidebar** (~336px) + fluid white content area. Spacing is built on a 4px grid (gaps of 4/6/8/12/16/24).

**Transparency &amp; blur.** Minimal. Used for the avatar inset ring and disabled opacity; no heavy glassmorphism.

---

## ICONOGRAPHY

- **Icon set: Tabler Icons.** The codebase imports directly from **`@tabler/icons-react`** (e.g. `IconEye`, `IconEyeOff`, `IconSearch`, `IconX`, `IconBoltFilled`, `IconFlameFilled`, `IconTrophyFilled`). This is the canonical set — outline (stroke ~1.75–2px) for most UI, **filled** variants for gamification glyphs. Tabler is CDN-available, so recreations should **load Tabler from CDN** (`@tabler/icons-webfont` or inline SVGs) rather than redrawing.
- **Sizes** track button/badge size: 16 / 18 / 20 / 24 px (icon-button: 16/18/20/24; svg widths 4/4.5/5/6 in Tailwind units).
- **Custom glyphs.** A few brand-specific marks exist in the Figma `Icons` page (e.g. the **pentagon** "home" tab glyph, **trophy** rating tab). The bottom-tab icons read as: pentagon = Home, briefcase = Diary/Schedule, chat bubble = Chats, trophy = Rating, avatar = Profile. Where a custom glyph isn't available, use the nearest Tabler equivalent.
- **Logo.** `assets/logo-mark.png` — black rounded-square app icon with a white **puzzle piece** (the "🧩" in the file name). Used at ~40–48px with the wordmark "Bilimtrack" beside it.
- **Emoji:** not used as UI icons. **Unicode:** the up/down trend carets (▲▼) appear beside percentages; otherwise meaning is carried by Tabler icons + color.

&gt; **FONT FLAG:** "EFour Digital Pro" (rare display numerals) is not on Google Fonts and is **substituted with Orbitron**. If you have the real font file, drop it into `fonts/` and update `--font-display` in `colors_and_type.css`. TikTok Sans and Inter are loaded from Google Fonts and match the source.

---

## Index / manifest

Root files:
- **`README.md`** — this file.
- **`colors_and_type.css`** — all color tokens (raw palette, semantic surfaces/text/icon/stroke, buttons, badges, grades, gamification), radii, shadows, the full type scale + drop-in `.t-*` / `.c-*` / `.icon` classes.
- **`globals.reference.css`** — the **real production Tailwind v4 theme** (provided by the team); the authoritative source for every token, including dark mode. `colors_and_type.css` is a flattened, framework-free distillation of it.
- **`SKILL.md`** — Agent-Skill manifest for reuse in Claude Code.
- **`assets/`** — `logo-mark.png`, `mascot-panda.png` (brand mascot / login hero), `banner-cover.png` (lofi study banner art), `avatar-default.png` (panda-eared placeholder).
- **`preview/`** — Design-System cards (colors, type, grades, components, etc.) shown in the Design System tab.
- **`ui_kits/`** — high-fidelity interactive recreations, one folder per surface:
  - `ui_kits/learner/` — the student mobile app (login, diary, schedule, chats, rating, profile).
  - `ui_kits/mentor/` — the teacher desktop web console (login, journal/gradebook, chats, news).
- Each UI kit has its own `README.md`, `index.html` and JSX components.
- **`SKILL.md`** — Agent-Skill manifest so this system can be downloaded and used in Claude Code.

</design-system-guide>

CSS tokens: the guide may describe tokens in prose, but the exact `--*` names are defined in the design system's stylesheet(s) (`/projects/1305caee-8964-4089-ac71-f7642d1ddfed/colors_and_type.css`, `/projects/1305caee-8964-4089-ac71-f7642d1ddfed/globals.reference.css`, `/projects/1305caee-8964-4089-ac71-f7642d1ddfed/uploads/globals.css`). The 620 custom properties it defines are:

--ag-background-color, --ag-border-color, --ag-column-hover-background-color, --ag-font-family, --ag-font-size, --ag-foreground-color, --ag-header-background-color, --ag-header-column-separator-color, --ag-header-column-separator-display, --ag-header-column-separator-height, --ag-header-foreground-color, --ag-header-height, --ag-odd-row-background-color, --ag-row-border-color, --ag-row-height, --ag-row-hover-background-color, --amber-50, --amber-500, --background, --badge-border, --badge-error, --badge-inverse, --badge-outline, --badge-primary, --badge-secondary, --badge-success, --base-100, --base-200, --base-300, --base-400, --base-50, --base-500, --base-600, --base-700, --base-800, --base-900, --base-950, --base-logo-ourerasoft, --black, --blue-100, --blue-400, --blue-50, --blue-500, --blue-600, --blue-700, --btn-error-default, --btn-error-hover, --btn-outline-default, --btn-primary-default, --btn-primary-hover, --btn-secondary-default, --btn-secondary-hover, --color-accent, --color-accent-foreground, --color-amber-100, --color-amber-200, --color-amber-300, --color-amber-400, --color-amber-50, --color-amber-500, --color-amber-600, --color-amber-700, --color-amber-800, --color-amber-900, --color-amber-950, --color-background, --color-badge-error, --color-badge-inverse, --color-badge-outline, --color-badge-primary, --color-badge-secondary, --color-badge-success, --color-base-100, --color-base-200, --color-base-300, --color-base-400, --color-base-50, --color-base-500, --color-base-600, --color-base-700, --color-base-800, --color-base-900, --color-base-950, --color-black, --color-blue-100, --color-blue-200, --color-blue-300, --color-blue-400, --color-blue-50, --color-blue-500, --color-blue-600, --color-blue-700, --color-blue-800, --color-blue-900, --color-blue-950, --color-border, --color-btn-error-default, --color-btn-error-hover, --color-btn-outline-default, --color-btn-primary-default, --color-btn-primary-hover, --color-btn-secondary-default, --color-btn-secondary-hover, --color-card, --color-card-foreground, --color-chart-1, --color-chart-2, --color-chart-3, --color-chart-4, --color-chart-5, --color-cyan-100, --color-cyan-200, --color-cyan-300, --color-cyan-400, --color-cyan-50, --color-cyan-500, --color-cyan-600, --color-cyan-700, --color-cyan-800, --color-cyan-900, --color-cyan-950, --color-destructive, --color-emerald-100, --color-emerald-200, --color-emerald-300, --color-emerald-400, --color-emerald-50, --color-emerald-500, --color-emerald-600, --color-emerald-700, --color-emerald-800, --color-emerald-900, --color-emerald-950, --color-foreground, --color-fuchsia-100, --color-fuchsia-200, --color-fuchsia-300, --color-fuchsia-400, --color-fuchsia-50, --color-fuchsia-500, --color-fuchsia-600, --color-fuchsia-700, --color-fuchsia-800, --color-fuchsia-900, --color-fuchsia-950, --color-gamification-points-icon, --color-gamification-points-main, --color-gamification-points-subtle, --color-gamification-points-surface, --color-gamification-points-surface-subtle, --color-gamification-points-text, --color-gamification-rating-icon, --color-gamification-rating-main, --color-gamification-rating-subtle, --color-gamification-rating-surface, --color-gamification-rating-surface-subtle, --color-gamification-rating-text, --color-gamification-streak-end, --color-gamification-streak-start, --color-grade-a-onsolid, --color-grade-a-surface, --color-grade-average-onsolid, --color-grade-average-surface, --color-grade-b-onsolid, --color-grade-b-surface, --color-grade-c-onsolid, --color-grade-c-surface, --color-grade-excellent-onsolid, --color-grade-excellent-surface, --color-grade-good-onsolid, --color-grade-good-surface, --color-grade-n-onsolid, --color-grade-n-surface, --color-grade-poor-onsolid, --color-grade-poor-surface, --color-gray-100, --color-gray-200, --color-gray-300, --color-gray-400, --color-gray-50, --color-gray-500, --color-gray-600, --color-gray-700, --color-gray-800, --color-gray-900, --color-gray-950, --color-green-100, --color-green-200, --color-green-300, --color-green-400, --color-green-50, --color-green-500, --color-green-600, --color-green-700, --color-green-800, --color-green-900, --color-green-950, --color-icon-brand, --color-icon-disabled, --color-icon-error, --color-icon-link, --color-icon-muted, --color-icon-on-solid, --color-icon-primary, --color-icon-soft, --color-icon-subtle, --color-icon-success, --color-icon-warning, --color-indigo-100, --color-indigo-200, --color-indigo-300, --color-indigo-400, --color-indigo-50, --color-indigo-500, --color-indigo-600, --color-indigo-700, --color-indigo-800, --color-indigo-900, --color-indigo-950, --color-input, --color-lime-100, --color-lime-200, --color-lime-300, --color-lime-400, --color-lime-50, --color-lime-500, --color-lime-600, --color-lime-700, --color-lime-800, --color-lime-900, --color-lime-950, --color-muted, --color-muted-foreground, --color-neutral-100, --color-neutral-200, --color-neutral-300, --color-neutral-400, --color-neutral-50, --color-neutral-500, --color-neutral-600, --color-neutral-700, --color-neutral-800, --color-neutral-900, --color-neutral-950, --color-orange-100, --color-orange-200, --color-orange-300, --color-orange-400, --color-orange-50, --color-orange-500, --color-orange-600, --color-orange-700, --color-orange-800, --color-orange-900, --color-orange-950, --color-pink-100, --color-pink-200, --color-pink-300, --color-pink-400, --color-pink-50, --color-pink-500, --color-pink-600, --color-pink-700, --color-pink-800, --color-pink-900, --color-pink-950, --color-popover, --color-popover-foreground, --color-primary, --color-primary-foreground, --color-purple-100, --color-purple-200, --color-purple-300, --color-purple-400, --color-purple-50, --color-purple-500, --color-purple-600, --color-purple-700, --color-purple-800, --color-purple-900, --color-purple-950, --color-red-100, --color-red-200, --color-red-300, --color-red-400, --color-red-50, --color-red-500, --color-red-600, --color-red-700, --color-red-800, --color-red-900, --color-red-950, --color-ring, --color-rose-100, --color-rose-200, --color-rose-300, --color-rose-400, --color-rose-50, --color-rose-500, --color-rose-600, --color-rose-700, --color-rose-800, --color-rose-900, --color-rose-950, --color-scroll-bg, --color-scroll-pill, --color-secondary, --color-secondary-foreground, --color-separator-primary, --color-separator-secondary, --color-sidebar, --color-sidebar-accent, --color-sidebar-accent-foreground, --color-sidebar-border, --color-sidebar-foreground, --color-sidebar-primary, --color-sidebar-primary-foreground, --color-sidebar-ring, --color-sky-100, --color-sky-200, --color-sky-300, --color-sky-400, --color-sky-50, --color-sky-500, --color-sky-600, --color-sky-700, --color-sky-800, --color-sky-900, --color-sky-950, --color-slate-100, --color-slate-200, --color-slate-300, --color-slate-400, --color-slate-50, --color-slate-500, --color-slate-600, --color-slate-700, --color-slate-800, --color-slate-900, --color-slate-950, --color-soft-shadow, --color-stone-100, --color-stone-200, --color-stone-300, --color-stone-400, --color-stone-50, --color-stone-500, --color-stone-600, --color-stone-700, --color-stone-800, --color-stone-900, --color-stone-950, --color-stroke-brand, --color-stroke-error, --color-stroke-focus, --color-stroke-gradient, --color-stroke-gradient-direction, --color-stroke-gradient-end, --color-stroke-gradient-start, --color-stroke-image-edge, --color-stroke-inverse, --color-stroke-offset, --color-stroke-primary, --color-stroke-secondary, --color-surface-brand, --color-surface-highest, --color-surface-lowest, --color-surface-middle, --color-surface-subtle, --color-surface-success, --color-teal-100, --color-teal-200, --color-teal-300, --color-teal-400, --color-teal-50, --color-teal-500, --color-teal-600, --color-teal-700, --color-teal-800, --color-teal-900, --color-teal-950, --color-text-background, --color-text-brand, --color-text-disabled, --color-text-error, --color-text-inverse, --color-text-link, --color-text-muted, --color-text-on-solid, --color-text-placeholder, --color-text-primary, --color-text-subtle, --color-text-success, --color-text-warning, --color-theme-brand-100, --color-theme-brand-200, --color-theme-brand-300, --color-theme-brand-400, --color-theme-brand-50, --color-theme-brand-500, --color-theme-brand-600, --color-theme-brand-700, --color-theme-brand-800, --color-theme-brand-900, --color-theme-brand-950, --color-violet-100, --color-violet-200, --color-violet-300, --color-violet-400, --color-violet-50, --color-violet-500, --color-violet-600, --color-violet-700, --color-violet-800, --color-violet-900, --color-violet-950, --color-white, --color-yellow-100, --color-yellow-200, --color-yellow-300, --color-yellow-400, --color-yellow-50, --color-yellow-500, --color-yellow-600, --color-yellow-700, --color-yellow-800, --color-yellow-900, --color-yellow-950, --color-zinc-100, --color-zinc-200, --color-zinc-300, --color-zinc-400, --color-zinc-50, --color-zinc-500, --color-zinc-600, --color-zinc-700, --color-zinc-800, --color-zinc-900, --color-zinc-950, --core-background, --cyan-400, --effects-primary, --font-display, --font-mono, --font-numeric, --font-sans, --font-ui, --fs-body-md, --fs-body-sm, --fs-callout-lg, --fs-callout-md, --fs-callout-sm, --fs-headline-sm, --fs-label-lg, --fs-label-md, --fs-label-sm, --fs-subheadline-lg, --fs-subheadline-md, --fs-subheadline-sm, --fs-subheadline-xs, --fs-title-lg, --fs-title-md, --gami-points-surface, --gami-points-surface-subtle, --gami-points-text, --gami-rating-surface, --gami-rating-surface-subtle, --gami-rating-text, --gami-streak-gradient, --gamification-points-icon, --gamification-points-main, --gamification-points-subtle, --gamification-points-surface, --gamification-points-surface-subtle, --gamification-points-text, --gamification-rating-icon, --gamification-rating-main, --gamification-rating-subtle, --gamification-rating-surface, --gamification-rating-surface-subtle, --gamification-rating-text, --gamification-streak-end, --gamification-streak-start, --gold, --grade-2-onsolid, --grade-2-surface, --grade-3-onsolid, --grade-3-surface, --grade-4-onsolid, --grade-4-surface, --grade-5-onsolid, --grade-5-surface, --grade-a-onsolid, --grade-a-surface, --grade-average-onsolid, --grade-average-surface, --grade-b-onsolid, --grade-b-surface, --grade-c-onsolid, --grade-c-surface, --grade-excellent-onsolid, --grade-excellent-surface, --grade-good-onsolid, --grade-good-surface, --grade-n-onsolid, --grade-n-surface, --grade-poor-onsolid, --grade-poor-surface, --green-100, --green-500, --green-600, --green-950, --icon-brand, --icon-disabled, --icon-error, --icon-link, --icon-muted, --icon-on-solid, --icon-primary, --icon-soft, --icon-subtle, --icon-success, --icon-warning, --lh-body-md, --lh-body-sm, --lh-callout-lg, --lh-callout-md, --lh-callout-sm, --lh-headline-sm, --lh-label-lg, --lh-label-md, --lh-label-sm, --lh-subheadline-lg, --lh-subheadline-md, --lh-subheadline-sm, --lh-subheadline-xs, --lh-title-lg, --lh-title-md, --logo-primary, --logo-surface, --neutral-0, --neutral-100, --neutral-200, --neutral-300, --neutral-400, --neutral-50, --neutral-500, --neutral-600, --neutral-700, --neutral-800, --neutral-900, --orange-400, --orange-50, --orange-500, --purple-50, --purple-500, --radius-2xl, --radius-3xl, --radius-4xl, --radius-full, --radius-lg, --radius-md, --radius-sm, --radius-xl, --red-50, --red-500, --red-600, --scroll-bg, --scroll-pill, --separator-primary, --separator-secondary, --shadow-card, --shadow-pop, --shadow-toggle, --soft-shadow, --status-bar, --stroke-brand, --stroke-error, --stroke-focus, --stroke-gradient, --stroke-gradient-direction, --stroke-gradient-end, --stroke-gradient-start, --stroke-image-edge, --stroke-inverse, --stroke-offset, --stroke-primary, --stroke-secondary, --stroke-tertiary, --surface-app, --surface-brand, --surface-highest, --surface-inverse, --surface-lowest, --surface-middle, --surface-subtle, --surface-success, --text-brand, --text-disabled,, …[truncated — read the full stylesheet]

Only use `var(--*)` names from that list. Never guess a token name — an unresolved `var()` silently falls back to the browser default.

For assets and UI kits beyond the guide: `read_file("/projects/1305caee-8964-4089-ac71-f7642d1ddfed/<path>")` and `copy_files` to bring them into the current project.
</attached-skill>

## Assistant

_[tool: list_files]_

_[tool: read_file]_

I'll start by exploring the Bilimtrack design system to understand the visual vocabulary, then ask you a few focused questions before building.

_[tool: read_file]_

_[tool: view_image]_

_[tool: view_image]_

_[tool: questions_v2]_

The design system is rich and the spec is detailed. Before I build, a few focused questions so I nail it the first time:

## User

Questions answered:
- scope: All three (Blog home, Article, Category) — fully linked
- header_nav: Minimal: logo + Блог + «Получить демо» button
- content: Write realistic sample content in Russian (МУИТ case study etc.)
- covers: Use styled placeholder covers (brand gradients + mascot/abstract)
- interactivity: Real working category filter + load-more (clickable prototype)
- variations: Decide for me
- tweaks: Accent color usage, Card density / columns, Corner radius (sharp vs pill), Decide for me
- density: Match app exactly — airy, white, hairline borders

## Assistant

_[tool: update_todos]_

_[tool: list_files]_

Got it. Let me set up the project and pull in what I need.

_[tool: copy_files]_

_[tool: view_image]_

_[tool: read_file]_

_[tool: write_file]_

Everything I need is in place. The mascot is a clean white panda in a blue hoodie on transparent/white. Now let me build the system. I'll write a shared stylesheet first.

_[tool: write_file]_

Now the article-specific stylesheet (prose typography, TOC, in-content CTAs, share, related):

_[tool: write_file]_

Now the shared data + cover/render helpers:

_[tool: write_file]_

Now the Blog Home page:

_[tool: show_html]_

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: read_file]_

Icons render as solid squares — the mask isn't applying. Let me check an icon file.

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: eval_js]_

_[tool: run_script]_

Found it — `url()` inside a custom property resolves relative to the **consuming stylesheet** (`assets/blog.css`), not the HTML. So `assets/icons/...` becomes `assets/assets/icons/...`. Fix: drop the `assets/` prefix on icon paths.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: show_html]_

_[tool: eval_js]_

Now the path is correct. Let me screenshot to confirm icons render as shapes.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: run_script]_

Icons resolve correctly now — but CSS masks don't render in the screenshot tool (and won't in PDF export). For robustness I'll switch to inline SVGs. Let me grab the path data I need.

_[tool: run_script]_

Let me generate an inline-SVG icon module (normalized + custom share glyphs), which renders reliably everywhere.

_[tool: str_replace_edit]_

_[tool: run_script]_

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

_[tool: grep]_

_[tool: str_replace_edit]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

Icons render now. Let me see the hero post and grid below the fold.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: write_file]_

Home page is polished and responsive. Now the Article page with full prose, TOC scroll-spy, and reading progress.

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: write_file]_

Final CTA looks great. Now the Category page:

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: copy_starter_component]_

All three pages work. Now let me add the Tweaks panel (accent color, columns, radius). Copying the starter:

_[tool: write_file]_

The Tweaks panel is React. I'll mount it into each plain-HTML page and have it drive the CSS variables the stylesheet already reads. Writing the tweaks app:

_[tool: run_script]_

Now wire the Tweaks panel into all three pages:

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: eval_js]_

_[tool: grep]_

_[tool: eval_js]_

Panel renders null until activated (expected). Let me simulate activation and verify the controls + that a tweak applies.

_[tool: eval_js]_

The panel renders with all controls. Let me screenshot it and test that changing accent + columns actually applies.

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

_[tool: eval_js]_

The Tweaks wiring is live. Let me functionally verify the home filter + load-more, then finalize.

_[tool: delete_file]_

_[tool: snip]_

_[tool: snip]_

Everything works — filter, hero toggle, load-more pagination, and Tweaks all behave correctly. Let me clean up scratch screenshots and finalize.

_[tool: done]_

_[tool: fork_verifier_agent]_

Built the full **Bilimtrack blog** — three linked, working pages on the design system (TikTok Sans, brand blue, hairline borders, pills, panda mascot):

- **Blog Home.html** — section hero, live category filter (no reload), featured hero-post, 3-col card grid + sidebar (demo CTA, popular, categories), "Загрузить ещё" pagination.
- **Article.html** — МУИТ case study with breadcrumbs, byline + share (Telegram/WhatsApp/copy), sticky TOC with scroll-spy, reading-progress bar, full prose system (H2/H3, blockquote, list, figure, table, code, callout), inline + final CTA, "Читать также".
- **Category.html** — filtered grid with category title + description, reads `?c=slug`.

Cards link through (`Article.html?a=…`, `Category.html?c=…`), covers are styled product-mock placeholders per category, and it's fully responsive (3→2→1 col, sidebar drops below, mobile TOC accordion, scrollable filter row).

**Tweaks** (toolbar toggle): accent color, column count (2/3/4), corner radius.

Two things to flag:
- Covers are abstract placeholders — swap in real interface screenshots (16:9 WebP) when ready; each is one `coverHTML` scene in `assets/blog.js`.
- The article body is realistic sample copy. Hand me final text and I'll drop it in.

## User

Создай страницу админимстратора  где он пишет статьи

## Assistant

_[tool: update_todos]_

_[tool: list_files]_

_[tool: run_script]_

Good idea — an admin authoring screen completes the loop. I'll build a desktop **CMS editor** that matches the Mentor console pattern (white left sidebar nav + content area + right settings rail) and reuses the blog's tokens, covers, and icons. It'll be a working prototype: live formatting toolbar, auto reading-time, slug, cover picker, draft/publish, and a real preview.

_[tool: write_file]_

I need editor/admin icons that aren't in the set. I'll extend the inline icon module with Tabler glyphs, then build the console. Writing the icon extension + admin stylesheet:

_[tool: write_file]_

_[tool: write_file]_

Now the editor page itself — working WYSIWYG with live reading-time, slug, cover picker, draft/publish, and autosave:

_[tool: show_html]_

_[tool: get_webview_logs]_

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

Two things to check: the seed content didn't populate (likely a stale empty draft in localStorage from my iframe), and the topbar is overflowing at this narrow width. Let me clear storage and re-examine.

_[tool: show_html]_

_[tool: save_screenshot]_

_[tool: view_image]_

_[tool: eval_js]_

Word count says 91 but title shows placeholder — contradictory. Let me inspect the live values.

_[tool: eval_js]_

Values are correct — the screenshot tool just doesn't serialize live `<textarea>`/date values (known limitation). But the topbar overflow looks real. Let me check dimensions.

_[tool: str_replace_edit]_

_[tool: str_replace_edit]_

Values are all correct — the screenshot tool just doesn't render live `<textarea>`/date values. The real issue is the desktop topbar overflowing at the narrow preview width (it needs 610px in a 404px column). This is a 1536px desktop tool, but I'll make the topbar collapse gracefully so it looks right at any width. Let me wrap the labels and add responsive rules.

_[tool: show_html]_

_[tool: eval_js]_

_[tool: eval_js]_

No overflow now. Let me verify the editor interactions and capture the full layout.

_[tool: eval_js]_

Publish, slug, toast all work. Two `data-ic` placeholders didn't hydrate — let me find them.

_[tool: str_replace_edit]_

`pencil` and `settings` weren't in either icon map. Let me add them.

_[tool: show_html]_

_[tool: eval_js]_

_[tool: save_screenshot]_

_[tool: view_image]_

Now let me reload and capture the full layout (top + rail scrolled).

_[tool: save_screenshot]_

_[tool: view_image]_

Clean and on-brand — all icons hydrate, topbar fits, rail is tidy. Let me confirm the toolbar and cover-preset rail render by scrolling.

_[tool: eval_js]_

_[tool: update_todos]_

_[tool: delete_file]_

Verified functionally — 12 toolbar tools, 7 cover presets, working publish/slug/toast/reading-time, all icons hydrate, responsive topbar fits. (The screenshot tool can't show scrolled inner panels or live textarea values, but eval confirmed them.) Let me clear my test draft so the user lands on the clean seeded state, then finalize.

_[tool: done]_

_[tool: fork_verifier_agent]_

Готово — добавил **Admin.html**, страницу редактора статей для администратора блога.

Это десктопный CMS-редактор, построенный по модели консоли Mentor (белая левая навигация + центр + правая панель настроек), на тех же токенах и стиле, что и блог:

- **Левая навигация** — Статьи, Новая статья, Категории, Медиа, Статистика, Авторы + профиль редактора и «Разработано OurEra Soft».
- **Редактор (центр)** — обложка 16:9, тег категории, заголовок и краткое описание, панель форматирования (H2/H3, жирный, курсив, ссылка, списки, цитата) и вставка блоков: **Важно** (callout), **CTA на демо**, изображение, плюс кнопка-помощник для черновика.
- **Панель настроек (справа)** — переключатель Черновик/Опубликовано, выбор категории, автоматическое **время чтения** (~200 слов/мин со счётчиком слов), дата публикации, **slug** (автотранслитерация из заголовка), выбор обложки из 7 пресетов, SEO-поля с счётчиками символов (Title 60 / OG-описание 160).
- **Работает по-настоящему**: форматирование через contenteditable, автосохранение черновика в localStorage, «Предпросмотр» открывает статью, «Опубликовать» валидирует заголовок и показывает тост с финальным URL.

Пара заметок:
- Это десктопный инструмент (рассчитан на ~1536px); топбар аккуратно сворачивается на узких экранах, ниже ~880px панели скрываются.
- Помощник и список статей сейчас демонстрационные — скажите, если нужен реальный список черновиков/публикаций или интеграция генерации текста.

## User

Verifier agent check completed

## Assistant

