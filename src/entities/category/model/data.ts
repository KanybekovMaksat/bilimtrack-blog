import type { ArticleCategory, Category, CategoryKey } from "./types";

export const CATEGORIES: Category[] = [
  { key: "all", label: "Все" },
  { key: "manage", label: "Управление школой" },
  { key: "cases", label: "Кейсы" },
  { key: "advice", label: "Советы директору" },
  { key: "news", label: "Новости" },
];

/** Descriptions for category landing pages. */
export const CAT_DESC: Record<ArticleCategory, string> = {
  manage:
    "Как навести порядок в расписании, журнале и отчётности с помощью цифровых инструментов.",
  cases:
    "Реальные истории внедрения Bilimtrack в учебных организациях Кыргызстана и СНГ.",
  advice:
    "Практические советы руководителям: метрики, процессы, мотивация команды и студентов.",
  news: "Обновления продукта, новые модули и важные события Bilimtrack.",
};

export const CAT_LABEL: Record<CategoryKey, string> = Object.fromEntries(
  CATEGORIES.map((c) => [c.key, c.label]),
) as Record<CategoryKey, string>;
