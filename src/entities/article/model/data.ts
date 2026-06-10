import type { Article } from "./types";

/** Sample editorial content (Russian) — mirrors the design prototype. */
export const ARTICLES: Article[] = [
  {
    slug: "muit-cifrovoe-upravlenie",
    cat: "cases",
    cover: "journal",
    title: "Как МУИТ перешёл на цифровое управление учебным процессом",
    date: "15 января 2025",
    iso: "2025-01-15",
    read: 8,
    featured: true,
    popular: true,
    excerpt:
      "Рассказываем, как международный университет автоматизировал расписание, журнал и оплату — и за один семестр избавился от бумажной рутины.",
  },
  {
    slug: "raspisanie-bez-haosa",
    cat: "manage",
    cover: "schedule",
    title: "Расписание без хаоса: как собрать сетку занятий на семестр",
    date: "9 января 2025",
    iso: "2025-01-09",
    read: 6,
    popular: true,
    excerpt:
      "Числитель и знаменатель, замены, окна у преподавателей — разбираем, как держать расписание в порядке без таблиц в Excel.",
  },
  {
    slug: "5-metrik-direktora",
    cat: "advice",
    cover: "rating",
    title: "5 метрик, которые директор должен смотреть каждую неделю",
    date: "6 января 2025",
    iso: "2025-01-06",
    read: 5,
    popular: true,
    excerpt:
      "Посещаемость, успеваемость, собираемость оплат и ещё две цифры, которые показывают здоровье организации раньше, чем проблемы станут заметны.",
  },
  {
    slug: "kolledzh-osh-otchyotnost",
    cat: "cases",
    cover: "journal",
    title: "Колледж в Оше: как сократили бумажную отчётность на 70%",
    date: "28 декабря 2024",
    iso: "2024-12-28",
    read: 7,
    popular: true,
    excerpt:
      "История о том, как один администратор перестал собирать ведомости вручную и вернул себе два рабочих дня в неделю.",
  },
  {
    slug: "elektronnyj-zhurnal",
    cat: "manage",
    cover: "schedule",
    title: "Электронный журнал: что это меняет для преподавателей",
    date: "20 декабря 2024",
    iso: "2024-12-20",
    read: 5,
    excerpt:
      "Меньше формальностей, больше прозрачности. Как журнал в Bilimtrack экономит время и снимает споры об оценках.",
  },
  {
    slug: "modul-onlajn-oplaty",
    cat: "news",
    cover: "news",
    title: "Bilimtrack запускает модуль онлайн-оплаты обучения",
    date: "16 декабря 2024",
    iso: "2024-12-16",
    read: 3,
    excerpt:
      "Родители оплачивают обучение прямо из приложения, а бухгалтерия видит платежи в реальном времени.",
  },
  {
    slug: "gejmifikaciya-motivaciya",
    cat: "advice",
    cover: "rating",
    title: "Как мотивировать учеников: геймификация в учебном процессе",
    date: "10 декабря 2024",
    iso: "2024-12-10",
    read: 6,
    popular: true,
    excerpt:
      "Рейтинги, баллы и серии (streak) — что из игровых механик действительно работает в школе, а что лучше не трогать.",
  },
  {
    slug: "yazykovaya-shkola-1200",
    cat: "cases",
    cover: "chat",
    title: "Языковая школа на 1200 студентов: переход за один месяц",
    date: "2 декабря 2024",
    iso: "2024-12-02",
    read: 9,
    excerpt:
      "Большой набор групп, гибкое расписание и чаты с родителями — как сеть языковых центров запустилась без остановки занятий.",
  },
  {
    slug: "chek-list-cifrovizacii",
    cat: "manage",
    cover: "stats",
    title: "Чек-лист цифровизации школы: с чего начать директору",
    date: "25 ноября 2024",
    iso: "2024-11-25",
    read: 7,
    excerpt:
      "Семь шагов от первого разговора с командой до полноценного электронного журнала — без паники и срыва учебного года.",
  },
  {
    slug: "itogi-goda-340-organizacij",
    cat: "news",
    cover: "brand",
    title: "Итоги года: 340 организаций выбрали Bilimtrack",
    date: "18 ноября 2024",
    iso: "2024-11-18",
    read: 4,
    excerpt:
      "Школы, колледжи и университеты, новые модули и планы на следующий год — коротко о том, каким был год для экосистемы.",
  },
];

/** Canonical in-app route to an article. */
export function articleHref(article: Pick<Article, "slug">): string {
  return `/blog/${article.slug}`;
}

export function findArticle(slug: string): Article | undefined {
  return ARTICLES.find((a) => a.slug === slug);
}

export function popularArticles(limit = 4, excludeSlug?: string): Article[] {
  return ARTICLES.filter(
    (a) => a.popular && a.slug !== excludeSlug,
  ).slice(0, limit);
}
