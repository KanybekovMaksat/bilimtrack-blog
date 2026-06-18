import { useState } from "react";
import Head from "next/head";
import NextLink from "next/link";
import { SiteHeader } from "@/widgets/site-header";
import { SiteFooter } from "@/widgets/site-footer";
import { FinalCta } from "@/widgets/final-cta";

// ─── Mock data ───────────────────────────────────────────────
const PLANS = [
  {
    id: "start",
    name: "Старт",
    badge: null,
    desc: "Для небольших школ и центров до 200 учеников",
    monthlyPrice: 29_900,
    yearlyPrice: 24_900,
    currency: "₸/мес",
    features: [
      "До 200 учеников",
      "Электронный журнал",
      "Расписание (до 20 классов)",
      "Мобильное приложение",
      "Уведомления родителям",
      "Email-поддержка",
    ],
    notIncluded: ["Аналитика и отчёты", "API-доступ", "Интеграция с 1С"],
    ctaLabel: "Начать бесплатно",
    ctaVariant: "outline" as const,
  },
  {
    id: "pro",
    name: "Профи",
    badge: "Популярный",
    desc: "Для средних и крупных школ до 1 000 учеников",
    monthlyPrice: 69_900,
    yearlyPrice: 57_900,
    currency: "₸/мес",
    features: [
      "До 1 000 учеников",
      "Всё из тарифа Старт",
      "Аналитика и отчёты",
      "Расписание (без ограничений)",
      "Интеграция с 1С",
      "Онлайн-оплата родителями",
      "Приоритетная поддержка",
    ],
    notIncluded: ["API-доступ"],
    ctaLabel: "Получить демо",
    ctaVariant: "primary" as const,
  },
  {
    id: "enterprise",
    name: "Корпоратив",
    badge: "Для сетей",
    desc: "Для колледжей, сетей школ и университетов",
    monthlyPrice: null,
    yearlyPrice: null,
    currency: "",
    features: [
      "Неограниченное число учеников",
      "Всё из тарифа Профи",
      "REST API-доступ",
      "SSO-авторизация",
      "Выделенный менеджер",
      "SLA 99.9%",
      "On-premise установка",
    ],
    notIncluded: [],
    ctaLabel: "Связаться с нами",
    ctaVariant: "outline" as const,
  },
];

const FAQ = [
  {
    q: "Есть ли бесплатный пробный период?",
    a: "Да — первые 3 месяца бесплатно для любого тарифа. Без привязки карты.",
  },
  {
    q: "Можно ли изменить тариф в процессе работы?",
    a: "Да. Переход между тарифами происходит мгновенно. При переходе на более дорогой тариф мы делаем перерасчёт.",
  },
  {
    q: "Как происходит внедрение?",
    a: "Наша команда проводит онбординг в течение 2–3 дней: настраивает систему, обучает персонал и мигрирует данные.",
  },
  {
    q: "Где хранятся данные?",
    a: "Все данные хранятся на серверах в Казахстане (Алматы, ЦОД Tier III) и соответствуют законодательству РК о персональных данных.",
  },
  {
    q: "Есть ли интеграция с государственными системами?",
    a: "Да — поддерживается выгрузка в НОБД (Национальная база данных в сфере образования) и интеграция с е-правительством.",
  },
];

function formatPrice(price: number) {
  return price.toLocaleString("ru-RU");
}

/** /pricing — subscription plans page */
export function PricingPage() {
  const [isYearly, setIsYearly] = useState(true);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <>
      <Head>
        <title>Цены — Bilimtrack</title>
        <meta
          name="description"
          content="Прозрачные тарифы для школ любого размера. Начните бесплатно — первые 3 месяца без оплаты."
        />
        <meta property="og:title" content="Цены — Bilimtrack" />
        <meta property="og:type" content="website" />
      </Head>

      <SiteHeader activeHref="/pricing" />

      <main className="page container">
        {/* ── Hero ── */}
        <section className="price-hero">
          <span className="feat-eyebrow">💳 Прозрачные цены</span>
          <h1>Тариф для любого масштаба</h1>
          <p className="feat-lead">
            Начните бесплатно. Первые 3 месяца — без оплаты и без привязки
            карты. Переходите на платный план только когда убедитесь в ценности.
          </p>

          {/* Billing toggle */}
          <div className="price-toggle" role="group" aria-label="Период оплаты">
            <button
              className={`price-toggle__btn${!isYearly ? " is-active" : ""}`}
              onClick={() => setIsYearly(false)}
            >
              Месяц
            </button>
            <button
              className={`price-toggle__btn${isYearly ? " is-active" : ""}`}
              onClick={() => setIsYearly(true)}
            >
              Год
              <span className="price-toggle__badge">−17%</span>
            </button>
          </div>
        </section>

        {/* ── Plans ── */}
        <section className="price-plans">
          {PLANS.map((plan) => (
            <div
              key={plan.id}
              className={`price-card${plan.id === "pro" ? " price-card--featured" : ""}`}
            >
              {plan.badge && (
                <span className="price-card__badge">{plan.badge}</span>
              )}
              <div className="price-card__header">
                <h2 className="price-card__name">{plan.name}</h2>
                <p className="price-card__desc">{plan.desc}</p>
              </div>

              <div className="price-card__price">
                {plan.monthlyPrice !== null ? (
                  <>
                    <span className="price-card__amount">
                      {formatPrice(isYearly ? plan.yearlyPrice! : plan.monthlyPrice)}
                    </span>
                    <span className="price-card__currency">{plan.currency}</span>
                    {isYearly && (
                      <span className="price-card__old">
                        {formatPrice(plan.monthlyPrice)}
                      </span>
                    )}
                  </>
                ) : (
                  <span className="price-card__custom">По запросу</span>
                )}
              </div>

              <NextLink
                href="#demo"
                className={`btn btn--block${plan.ctaVariant === "primary" ? " btn--primary" : " btn--outline"}`}
              >
                {plan.ctaLabel}
              </NextLink>

              <ul className="price-card__features">
                {plan.features.map((f) => (
                  <li key={f} className="price-feature price-feature--yes">
                    <span className="price-feature__icon">✓</span>
                    {f}
                  </li>
                ))}
                {plan.notIncluded.map((f) => (
                  <li key={f} className="price-feature price-feature--no">
                    <span className="price-feature__icon">–</span>
                    {f}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        {/* ── Guarantee ── */}
        <section className="price-guarantee">
          <div className="price-guarantee__icon">🛡️</div>
          <div>
            <h2>3 месяца бесплатно — без рисков</h2>
            <p>
              Мы уверены в продукте. Поэтому первые 3 месяца — абсолютно
              бесплатно. Если решите уйти — поможем выгрузить все данные.
            </p>
          </div>
        </section>

        {/* ── FAQ ── */}
        <section className="price-faq-section">
          <div className="feat-section-header">
            <h2>Частые вопросы</h2>
            <p>Всё что нужно знать перед принятием решения</p>
          </div>
          <div className="price-faq">
            {FAQ.map((item, i) => (
              <div
                key={i}
                className={`faq-item${openFaq === i ? " is-open" : ""}`}
              >
                <button
                  className="faq-item__q"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span className="faq-item__arrow">{openFaq === i ? "−" : "+"}</span>
                </button>
                {openFaq === i && (
                  <p className="faq-item__a">{item.a}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      </main>

      <FinalCta />
      <SiteFooter />
    </>
  );
}
