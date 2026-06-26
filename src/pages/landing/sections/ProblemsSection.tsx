import { useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ArrowRight, BarChart2, BookOpen, CalendarDays, TrendingUp } from "lucide-react";

const sections = [
  {
    key: "dashboard",
    label: "Дашборд",
    icon: BarChart2,
    description: "Все ключевые метрики организации в реальном времени",
    screenshot: "/dashboard.png",
    url: "bilimtrack.com/dashboard",
  },
    {
    key: "analytics",
    label: "Аналитика",
    icon: TrendingUp,
    description: "Отчёты и тренды без ручного сбора данных",
    screenshot: "/analytics.png",
    url: "bilimtrack.com/analytics",
  },
  {
    key: "journal",
    label: "Журнал и оценки",
    icon: BookOpen,
    description: "Электронный журнал, оценки и посещаемость в одном окне",
    screenshot: "/scorebook.png",
    url: "bilimtrack.com/journal",
  },
    {
    key: "schedule",
    label: "Расписание",
    icon: CalendarDays,
    description: "Гибкое расписание для всех групп и преподавателей",
    screenshot: "/schedule.png",
    url: "bilimtrack.com/schedule",
  },
];

export function ProblemsSection() {
  const [activeKey, setActiveKey] = useState("dashboard");
  const active = sections.find((s) => s.key === activeKey) ?? sections[0];

  return (
    <section className="py-10 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">

        <div className="text-center max-w-[760px] mx-auto mb-12 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight leading-[1.08]">
          Функции платформы Bilimtrack
          </h2>
                    <p className="mt-4 text-slate-500 text-base md:text-lg leading-relaxed">
            Это лишь часть возможностей платформы. Заполните заявку, чтобы посмотреть полностью экосистему.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] lg:grid-cols-[320px_1fr] gap-4 md:gap-8 items-start">

          <div className="flex flex-row md:flex-col gap-2 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
            {sections.map((s) => {
              const active = s.key === activeKey;
              return (
                <button
                  key={s.key}
                  onClick={() => setActiveKey(s.key)}
                  className={`flex items-center gap-3 text-left rounded-xl px-4 py-3.5 transition-all duration-150 shrink-0 md:shrink w-[200px] md:w-auto border ${
                    active
                      ? "bg-blue-50 border-blue-200"
                      : "bg-white border-neutral-100 hover:bg-neutral-50 hover:border-neutral-200"
                  }`}
                >
                  <span
                    className={`shrink-0 w-9 h-9 rounded-lg flex items-center justify-center mt-0.5 ${
                      active ? "bg-blue-600 text-white" : "bg-neutral-100 text-slate-400"
                    }`}
                  >
                    <s.icon className="w-4 h-4" />
                  </span>
                  <span className="flex flex-col gap-0.5 min-w-0">
                    <span
                      className={`text-sm font-semibold leading-snug ${
                        active ? "text-blue-700" : "text-slate-700"
                      }`}
                    >
                      {s.label}
                    </span>
                    {/* <span className="text-xs text-slate-400 leading-snug hidden md:block">
                      {s.description}
                    </span> */}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Right — screenshot frame */}
          <div className="rounded-xl bg-white border border-neutral-200 shadow-[0_24px_64px_-24px_rgba(16,32,64,.28),0_4px_12px_-4px_rgba(16,32,64,.08)] overflow-hidden">
            {/* Browser bar */}
            <div className="flex items-center gap-1.5 px-4 py-3 bg-neutral-50 border-b border-neutral-100">
              <span className="w-3 h-3 rounded-full bg-neutral-200" />
              <span className="w-3 h-3 rounded-full bg-neutral-200" />
              <span className="w-3 h-3 rounded-full bg-neutral-200" />
              <span className="ml-3 text-xs text-slate-400 font-mono bg-white border border-neutral-200 rounded-full px-3 py-1 truncate max-w-[240px]">
                {active.url}
              </span>
            </div>

            {/* Animated screenshot */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeKey}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="relative"
              >
                <img
                  src={active.screenshot}
                  alt={active.label}
                  className="w-full block"
                  onError={(e) => {
                    const img = e.currentTarget as HTMLImageElement;
                    img.style.display = "none";
                    const next = img.nextElementSibling as HTMLElement | null;
                    if (next) next.style.display = "flex";
                  }}
                />
                {/* Placeholder */}
                <div
                  className="hidden flex-col items-center justify-center gap-3 text-center px-8 py-24"
                  style={{
                    background:
                      "linear-gradient(#f5f5f5 1px,transparent 1px) 0 0/100% 28px,linear-gradient(90deg,#f5f5f5 1px,transparent 1px) 0 0/28px 100%,#fafafa",
                  }}
                >
                  <div className="w-14 h-14 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <active.icon className="w-7 h-7" />
                  </div>
                  <div className="text-sm font-semibold text-slate-400">{active.label}</div>
                  <div className="text-xs text-slate-300 max-w-[28ch]">
                    Добавьте {active.screenshot} в папку public
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="#demo"
            className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 text-blue-600 font-semibold text-sm px-6 py-3 hover:bg-blue-100 transition-colors"
          >
            Посмотреть демо <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </section>
  );
}
