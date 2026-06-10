/* ============================================================
   BILIMTRACK — Blog shared data + render helpers
   ============================================================ */

const CATEGORIES = [
  { key: "all",    label: "Все" },
  { key: "manage", label: "Управление школой" },
  { key: "cases",  label: "Кейсы" },
  { key: "advice", label: "Советы директору" },
  { key: "news",   label: "Новости" },
];

const CAT_DESC = {
  manage: "Как навести порядок в расписании, журнале и отчётности с помощью цифровых инструментов.",
  cases:  "Реальные истории внедрения Bilimtrack в учебных организациях Кыргызстана и СНГ.",
  advice: "Практические советы руководителям: метрики, процессы, мотивация команды и студентов.",
  news:   "Обновления продукта, новые модули и важные события Bilimtrack.",
};

const ARTICLES = [
  {
    slug: "muit-cifrovoe-upravlenie", cat: "cases", cover: "journal",
    title: "Как МУИТ перешёл на цифровое управление учебным процессом",
    date: "15 января 2025", iso: "2025-01-15", read: 8, featured: true, popular: true,
    excerpt: "Рассказываем, как международный университет автоматизировал расписание, журнал и оплату — и за один семестр избавился от бумажной рутины.",
  },
  {
    slug: "raspisanie-bez-haosa", cat: "manage", cover: "schedule",
    title: "Расписание без хаоса: как собрать сетку занятий на семестр",
    date: "9 января 2025", iso: "2025-01-09", read: 6, popular: true,
    excerpt: "Числитель и знаменатель, замены, окна у преподавателей — разбираем, как держать расписание в порядке без таблиц в Excel.",
  },
  {
    slug: "5-metrik-direktora", cat: "advice", cover: "rating",
    title: "5 метрик, которые директор должен смотреть каждую неделю",
    date: "6 января 2025", iso: "2025-01-06", read: 5, popular: true,
    excerpt: "Посещаемость, успеваемость, собираемость оплат и ещё две цифры, которые показывают здоровье организации раньше, чем проблемы станут заметны.",
  },
  {
    slug: "kolledzh-osh-otchyotnost", cat: "cases", cover: "journal",
    title: "Колледж в Оше: как сократили бумажную отчётность на 70%",
    date: "28 декабря 2024", iso: "2024-12-28", read: 7, popular: true,
    excerpt: "История о том, как один администратор перестал собирать ведомости вручную и вернул себе два рабочих дня в неделю.",
  },
  {
    slug: "elektronnyj-zhurnal", cat: "manage", cover: "schedule",
    title: "Электронный журнал: что это меняет для преподавателей",
    date: "20 декабря 2024", iso: "2024-12-20", read: 5,
    excerpt: "Меньше формальностей, больше прозрачности. Как журнал в Bilimtrack экономит время и снимает споры об оценках.",
  },
  {
    slug: "modul-onlajn-oplaty", cat: "news", cover: "news",
    title: "Bilimtrack запускает модуль онлайн-оплаты обучения",
    date: "16 декабря 2024", iso: "2024-12-16", read: 3,
    excerpt: "Родители оплачивают обучение прямо из приложения, а бухгалтерия видит платежи в реальном времени.",
  },
  {
    slug: "gejmifikaciya-motivaciya", cat: "advice", cover: "rating",
    title: "Как мотивировать учеников: геймификация в учебном процессе",
    date: "10 декабря 2024", iso: "2024-12-10", read: 6, popular: true,
    excerpt: "Рейтинги, баллы и серии (streak) — что из игровых механик действительно работает в школе, а что лучше не трогать.",
  },
  {
    slug: "yazykovaya-shkola-1200", cat: "cases", cover: "chat",
    title: "Языковая школа на 1200 студентов: переход за один месяц",
    date: "2 декабря 2024", iso: "2024-12-02", read: 9,
    excerpt: "Большой набор групп, гибкое расписание и чаты с родителями — как сеть языковых центров запустилась без остановки занятий.",
  },
  {
    slug: "chek-list-cifrovizacii", cat: "manage", cover: "stats",
    title: "Чек-лист цифровизации школы: с чего начать директору",
    date: "25 ноября 2024", iso: "2024-11-25", read: 7,
    excerpt: "Семь шагов от первого разговора с командой до полноценного электронного журнала — без паники и срыва учебного года.",
  },
  {
    slug: "itogi-goda-340-organizacij", cat: "news", cover: "brand",
    title: "Итоги года: 340 организаций выбрали Bilimtrack",
    date: "18 ноября 2024", iso: "2024-11-18", read: 4,
    excerpt: "Школы, колледжи и университеты, новые модули и планы на следующий год — коротко о том, каким был год для экосистемы.",
  },
];

const CAT_CLASS = { cases: "cases", manage: "manage", advice: "advice", news: "news" };
const CAT_LABEL = Object.fromEntries(CATEGORIES.map(c => [c.key, c.label]));

/* ---- Cover scenes (styled placeholders: abstract product mocks) ---- */
function coverHTML(article) {
  const grad = "cover--" + CAT_CLASS[article.cat];
  const scenes = {
    journal: `
      <div class="mock" style="width:74%;">
        <div class="mock__row"><div class="mock__bar" style="width:34%"></div><div style="flex:1"></div><div class="mock__pill g5">5</div><div class="mock__pill g4">4</div></div>
        <div class="mock__row"><div class="mock__bar" style="width:52%"></div><div style="flex:1"></div><div class="mock__pill g4">4</div><div class="mock__pill g3">3</div></div>
        <div class="mock__row"><div class="mock__bar" style="width:28%"></div><div style="flex:1"></div><div class="mock__pill g5">5</div><div class="mock__pill g5">5</div></div>
      </div>`,
    schedule: `
      <div class="mock" style="width:72%;gap:9px;">
        <div class="mock__row"><div style="width:30px;height:7px;border-radius:9999px;background:#dbe9ff"></div><div style="flex:1;height:24px;border-radius:7px;background:#155dfc"></div></div>
        <div class="mock__row"><div style="width:30px;height:7px;border-radius:9999px;background:#dbe9ff"></div><div style="flex:1;height:24px;border-radius:7px;background:#eef4ff"></div></div>
        <div class="mock__row"><div style="width:30px;height:7px;border-radius:9999px;background:#dbe9ff"></div><div style="flex:1;height:24px;border-radius:7px;background:#51a2ff"></div></div>
      </div>`,
    rating: `
      <div class="mock" style="width:72%;gap:11px;">
        <div class="mock__row"><div class="mock__pill" style="background:#ff8904">1</div><div class="mock__bar" style="flex:1;height:10px;background:#ffe6cf"></div></div>
        <div class="mock__row"><div class="mock__pill" style="background:#ad46ff">2</div><div class="mock__bar" style="width:78%;height:10px;background:#f0e2fd"></div></div>
        <div class="mock__row"><div class="mock__pill" style="background:#a1a1a1">3</div><div class="mock__bar" style="width:58%;height:10px;background:#eef0f3"></div></div>
      </div>`,
    chat: `
      <div style="width:74%;display:flex;flex-direction:column;gap:9px;">
        <div style="align-self:flex-start;background:#fff;border-radius:14px 14px 14px 4px;box-shadow:0 12px 28px -16px rgba(15,30,60,.3);padding:11px 13px;width:64%"><div class="mock__bar" style="width:90%"></div><div class="mock__bar" style="width:60%;margin-top:6px"></div></div>
        <div style="align-self:flex-end;background:#155dfc;border-radius:14px 14px 4px 14px;padding:11px 13px;width:52%"><div style="height:8px;border-radius:9999px;background:rgba(255,255,255,.85);width:80%"></div><div style="height:8px;border-radius:9999px;background:rgba(255,255,255,.55);width:50%;margin-top:6px"></div></div>
      </div>`,
    stats: `
      <div class="mock" style="width:72%;flex-direction:row;align-items:center;gap:16px;">
        <svg width="62" height="62" viewBox="0 0 62 62" style="flex:none">
          <circle cx="31" cy="31" r="26" fill="none" stroke="#eef0f3" stroke-width="9"/>
          <circle cx="31" cy="31" r="26" fill="none" stroke="#155dfc" stroke-width="9" stroke-linecap="round" stroke-dasharray="163" stroke-dashoffset="48" transform="rotate(-90 31 31)"/>
        </svg>
        <div style="flex:1;display:flex;flex-direction:column;gap:9px">
          <div class="mock__bar" style="width:90%;height:9px"></div>
          <div class="mock__bar" style="width:64%;height:9px"></div>
          <div class="mock__bar" style="width:78%;height:9px"></div>
        </div>
      </div>`,
    news: `
      <div class="mock" style="width:70%;gap:0;padding:0;overflow:hidden;">
        <div style="height:38px;background:linear-gradient(135deg,#ff8904,#ff6900)"></div>
        <div style="padding:13px;display:flex;flex-direction:column;gap:8px">
          <div class="mock__bar" style="width:86%"></div>
          <div class="mock__bar" style="width:58%"></div>
          <div style="display:flex;gap:6px;margin-top:4px"><div style="width:34px;height:16px;border-radius:9999px;background:#fff7ed"></div><div style="width:34px;height:16px;border-radius:9999px;background:#eff6ff"></div></div>
        </div>
      </div>`,
    brand: `
      <div class="cover__watermark" style="left:26px;top:22px;font-size:40px;color:rgba(255,255,255,.92)">Bilimtrack</div>
      <div class="cover__watermark" style="left:28px;top:74px;font-size:15px;font-weight:500;color:rgba(255,255,255,.55);letter-spacing:0">Образовательная экосистема</div>
      <img src="assets/mascot-panda.png" alt="" style="position:absolute;right:-6px;bottom:-10px;width:46%;max-width:200px;filter:drop-shadow(0 16px 30px rgba(0,0,0,.35))">`,
  };
  return `<div class="cover ${grad}"><div class="cover__chrome">${scenes[article.cover] || scenes.journal}</div></div>`;
}

/* ---- Card markup ---- */
function articleHref(a) { return `Article.html?a=${a.slug}`; }

function cardHTML(a) {
  return `
  <a class="card" href="${articleHref(a)}" data-cat="${a.cat}">
    <div class="card__cover">${coverHTML(a)}</div>
    <div class="card__body">
      <span class="tag tag--${CAT_CLASS[a.cat]}">${CAT_LABEL[a.cat]}</span>
      <h3 class="card__title">${a.title}</h3>
      <div class="card__meta"><span>${a.date}</span><span class="dot"></span><span>${a.read} мин чтения</span></div>
    </div>
  </a>`;
}

function heroPostHTML(a) {
  return `
  <a class="hero-post" href="${articleHref(a)}">
    <div class="hero-post__cover">${coverHTML(a)}</div>
    <div class="hero-post__body">
      <span class="hero-post__featured">${icon("bolt")}Главная статья</span>
      <span class="tag tag--${CAT_CLASS[a.cat]}">${CAT_LABEL[a.cat]}</span>
      <h2 class="hero-post__title">${a.title}</h2>
      <div class="card__meta"><span>${a.date}</span><span class="dot"></span><span>${a.read} мин чтения</span></div>
      <p class="hero-post__excerpt">${a.excerpt}</p>
      <span class="hero-post__read">Читать${icon("chevron-right")}</span>
    </div>
  </a>`;
}

/* ---- Sidebar blocks ---- */
function sidebarHTML(currentCat) {
  const popular = ARTICLES.filter(a => a.popular).slice(0, 4);
  const counts = {};
  CATEGORIES.filter(c => c.key !== "all").forEach(c => counts[c.key] = ARTICLES.filter(a => a.cat === c.key).length);
  return `
  <div class="side-block">
    <div class="cta-card">
      <img class="cta-card__mascot" src="assets/mascot-panda.png" alt="">
      <h3>Хотите посмотреть, как это работает?</h3>
      <p>Покажем Bilimtrack на примере вашей организации.</p>
      <a class="btn btn--primary" href="#demo">Получить демо${icon("chevron-right")}</a>
    </div>
  </div>
  <div class="side-block">
    <h4 class="side-block__title">Популярные статьи</h4>
    <div class="popular-list">
      ${popular.map((a, i) => `
        <a class="popular-item" href="${articleHref(a)}">
          <span class="popular-item__num">${i + 1}</span>
          <span><span class="popular-item__title">${a.title}</span><span class="popular-item__meta">${a.read} мин чтения</span></span>
        </a>`).join("")}
    </div>
  </div>
  <div class="side-block">
    <h4 class="side-block__title">Категории</h4>
    <nav class="cat-list">
      ${CATEGORIES.filter(c => c.key !== "all").map(c => `
        <a href="Category.html?c=${c.key}"${c.key === currentCat ? ' style="background:var(--surface-middle)"' : ''}>${c.label}<span class="n">${counts[c.key]}</span></a>`).join("")}
    </nav>
  </div>`;
}
