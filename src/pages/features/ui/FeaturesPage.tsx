import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { FinalCta } from "@/widgets/final-cta";

// ─── Mock data ───────────────────────────────────────────────
const FEATURES = [
  {
    id: "schedule",
    icon: "🗓️",
    title: "Управление расписанием",
    desc: "Составляйте и редактируйте расписание за считанные минуты. Учитывайте кабинеты, учителей и учебные группы без конфликтов.",
    tags: ["Автоматизация", "Расписание"],
    color: "#eff6ff",
    accent: "#155dfc",
  },
  {
    id: "journal",
    icon: "📓",
    title: "Электронный журнал",
    desc: "Выставляйте оценки и посещаемость в один клик. Родители видят успеваемость ребёнка в реальном времени.",
    tags: ["Журнал", "Родители"],
    color: "#f0fdf4",
    accent: "#00a63e",
  },
  {
    id: "analytics",
    icon: "📊",
    title: "Аналитика успеваемости",
    desc: "Отслеживайте динамику успеваемости по классам и предметам. Выявляйте слабые места и принимайте решения на основе данных.",
    tags: ["Аналитика", "Отчёты"],
    color: "#faf5ff",
    accent: "#ad46ff",
  },
  {
    id: "communication",
    icon: "💬",
    title: "Коммуникация с родителями",
    desc: "Встроенный мессенджер, push-уведомления и групповые рассылки. Всё общение в одном месте без сторонних приложений.",
    tags: ["Уведомления", "Чат"],
    color: "#fff7ed",
    accent: "#ea580c",
  },
  {
    id: "mobile",
    icon: "📱",
    title: "Мобильное приложение",
    desc: "Полноценный доступ для учителей, родителей и учеников с iOS и Android. Работает даже при слабом интернете.",
    tags: ["iOS", "Android"],
    color: "#fef2f2",
    accent: "#fb2c36",
  },
  {
    id: "integrations",
    icon: "🔗",
    title: "Интеграции и API",
    desc: "Подключите 1С, бухгалтерию, банковский эквайринг и государственные сервисы. REST API для собственных разработок.",
    tags: ["API", "1С"],
    color: "#f0fdf4",
    accent: "#00a63e",
  },
];

const STATS = [
  { num: "500+", label: "учебных организаций" },
  { num: "98%", label: "NPS — оценка клиентов" },
  { num: "−70%", label: "бумажной работы" },
  { num: "2–3 дня", label: "на внедрение" },
];

const HOW_IT_WORKS = [
  { step: "01", title: "Оставьте заявку", desc: "Заполните форму — наш менеджер свяжется с вами в течение 2 часов." },
  { step: "02", title: "Демо и настройка", desc: "Проведём демонстрацию и настроим систему под ваши нужды." },
  { step: "03", title: "Обучение команды", desc: "Обучим администраторов и учителей работе в системе (1–2 дня)." },
  { step: "04", title: "Запуск", desc: "Ваша организация работает в Bilimtrack. Мы на связи 24/7." },
];

/** /features — product capabilities overview page */
export function FeaturesPage() {
  const [activeTab, setActiveTab] = useState("all");

  const filtered =
    activeTab === "all"
      ? FEATURES
      : FEATURES.filter((f) => f.tags.some((t) => t.toLowerCase() === activeTab));

  return (
    <>
      <Head>
        <title>Возможности — Bilimtrack</title>
        <meta
          name="description"
          content="Управление расписанием, электронный журнал, аналитика успеваемости и коммуникация с родителями в одной системе."
        />
        <meta property="og:title" content="Возможности — Bilimtrack" />
        <meta property="og:type" content="website" />
      </Head>

      <SiteHeader activeHref="/features" />

      <main className="page container">
        {/* ── Hero ── */}
        <section className="feat-hero">
          <span className="feat-eyebrow">✨ Bilimtrack — платформа управления</span>
          <h1>Всё необходимое для&nbsp;современной школы</h1>
          <p className="feat-lead">
            Один инструмент вместо десятков таблиц и сервисов. Расписание,
            журнал, оплата и общение с родителями — в единой экосистеме.
          </p>
          <div className="feat-hero-ctas">
            <NextLink href="#demo" className="btn btn--primary">
              Получить демо →
            </NextLink>
            <NextLink href="/pricing" className="btn btn--outline">
              Посмотреть цены
            </NextLink>
          </div>
        </section>

        {/* ── Stats ── */}
        <section className="feat-stats">
          {STATS.map((s) => (
            <div key={s.label} className="feat-stat">
              <span className="feat-stat__num">{s.num}</span>
              <span className="feat-stat__label">{s.label}</span>
            </div>
          ))}
        </section>

        {/* ── Features grid ── */}
        <section className="feat-grid-section">
          <div className="feat-section-header">
            <h2>Ключевые возможности</h2>
            <p>Всё что нужно — уже внутри платформы</p>
          </div>

          <div className="feat-tabs">
            {["all", "Автоматизация", "Аналитика", "API"].map((tab) => (
              <button
                key={tab}
                className={`chip${activeTab === tab ? " is-active" : ""}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "all" ? "Все функции" : tab}
              </button>
            ))}
          </div>

          <div className="feat-grid">
            {filtered.map((f) => (
              <div key={f.id} className="feat-card" style={{ "--feat-color": f.color, "--feat-accent": f.accent } as any}>
                <div className="feat-card__icon">{f.icon}</div>
                <h3 className="feat-card__title">{f.title}</h3>
                <p className="feat-card__desc">{f.desc}</p>
                <div className="feat-card__tags">
                  {f.tags.map((t) => (
                    <span key={t} className="feat-tag">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── How it works ── */}
        <section className="feat-how">
          <div className="feat-section-header">
            <h2>Как начать работу</h2>
            <p>От заявки до запуска — всего 4 шага</p>
          </div>
          <div className="feat-steps">
            {HOW_IT_WORKS.map((item, i) => (
              <div key={item.step} className="feat-step">
                <div className="feat-step__num">{item.step}</div>
                {i < HOW_IT_WORKS.length - 1 && <div className="feat-step__line" />}
                <div className="feat-step__body">
                  <h3>{item.title}</h3>
                  <p>{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── Testimonial ── */}
        <section className="feat-quote">
          <blockquote>
            <p>
              «Bilimtrack сократил время составления расписания с трёх дней до
              двух часов. Учителя довольны, родители получают уведомления
              мгновенно.»
            </p>
            <footer>
              <strong>Айгуль Нурманова</strong>
              <span>Директор гимназии №47, Алматы</span>
            </footer>
          </blockquote>
        </section>
      </main>

      <FinalCta />
      <SiteFooter />
    </>
  );
}
