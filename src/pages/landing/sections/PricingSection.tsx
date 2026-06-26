import { useState } from "react";
import { Check, Sparkles } from "lucide-react";

type Period = "month" | "year";

const STEP = 100;
const MIN = 100;
const MAX = 1000;
const BASE = 10000;
const PER_100 = 5000;

function calcPrice(students: number, period: Period) {
  const monthly = BASE + (students / STEP) * PER_100;
  return period === "year" ? Math.round(monthly * 0.8) : monthly;
}

function fmt(n: number) {
  return n.toLocaleString("ru-RU");
}

const features = [
  "Расписание",
  "Журнал и оценки",
  "Посещаемость",
  "Кабинет родителя",
  "Кабинет студента",
  "Управление оплатой",
  "Справки и документы",
  "Форум и чат",
  "Аналитика директора",
  "Audit log",
  "База знаний + email",
  "Персональный менеджер",
];

const steps = Array.from({ length: (MAX - MIN) / STEP + 1 }, (_, i) => MIN + i * STEP);

export function PricingSection() {
  const [period, setPeriod] = useState<Period>("month");
  const [students, setStudents] = useState(300);
  const isEnterprise = students > MAX;
  const price = calcPrice(students, period);
  const periodLabel = period === "year" ? "в месяц при оплате за год" : "в месяц";

  return (
    <section id="pricing" className="py-10 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">

        {/* Header */}
        <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight leading-[1.08]">
            Прозрачные цены
          </h2>
          {/* <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Первые 3 месяца — бесплатно. Без карты. Миграция бесплатно. Отмена в любой момент.
          </p> */}

          {/* Period toggle */}
          <div className="inline-flex items-center gap-1 p-1 bg-neutral-100 rounded-full mt-6">
            <button
              onClick={() => setPeriod("month")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-150 ${
                period === "month" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              в месяц
            </button>
            <button
              onClick={() => setPeriod("year")}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-150 flex items-center gap-2 ${
                period === "year" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              в год{" "}
              <span className="text-[11px] font-bold text-green-600 bg-green-50 px-1.5 py-0.5 rounded-full">
                −20%
              </span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1fr] gap-8 items-start">

          {/* Calculator card */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-7 shadow-[0_4px_24px_-8px_rgba(0,0,0,.10)]">
            <p className="text-sm font-semibold text-slate-500 mb-5">Сколько учащихся?</p>

            {/* Step buttons */}
            <div className="flex flex-wrap gap-2 mb-6">
              {steps.map((s) => (
                <button
                  key={s}
                  onClick={() => setStudents(s)}
                  className={`rounded-full px-3.5 py-1.5 text-sm font-semibold border transition-colors duration-100 ${
                    students === s && !isEnterprise
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-slate-600 border-neutral-200 hover:border-blue-300 hover:text-blue-600"
                  }`}
                >
                  {s}
                </button>
              ))}
              <button
                onClick={() => setStudents(MAX + 1)}
                className={`rounded-full px-3.5 py-1.5 text-sm font-semibold border transition-colors duration-100 ${
                  isEnterprise
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-white text-slate-600 border-neutral-200 hover:border-blue-300 hover:text-blue-600"
                }`}
              >
                1000+
              </button>
            </div>

            {/* Slider */}
            <input
              type="range"
              min={MIN}
              max={MAX}
              step={STEP}
              value={isEnterprise ? MAX : students}
              onChange={(e) => setStudents(Number(e.target.value))}
              className="w-full accent-blue-600 mb-6"
            />

            {/* Price display */}
            <div className="border-t border-neutral-100 pt-6">
              {isEnterprise ? (
                <>
                  <div className="text-3xl font-bold tracking-tight text-slate-900">по запросу</div>
                  <div className="text-sm text-slate-400 mt-1">для 1000+ учащихся</div>
                  <a
                    href="#demo"
                    className="mt-5 flex items-center justify-center w-full rounded-full border border-neutral-200 bg-white text-slate-800 font-semibold text-sm px-4 py-3 hover:bg-neutral-50 transition-colors"
                  >
                    Написать нам
                  </a>
                </>
              ) : (
                <>
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold font-mono tracking-tight text-slate-900">
                      {fmt(price)}
                    </span>
                    <span className="text-lg text-slate-700">сом</span>
                  </div>
                  <div className="text-sm text-slate-400 mt-1">{periodLabel} · {students} учащихся</div>
                  <a
                    href="#demo"
                    className="mt-5 flex items-center justify-center w-full rounded-full bg-blue-600 text-white font-semibold text-sm px-4 py-3.5 hover:bg-blue-500 transition-colors"
                  >
                    Начать бесплатно — 3 месяца
                  </a>
                </>
              )}
            </div>
          </div>

          {/* Feature list */}
          <div>
            <p className="text-sm font-semibold text-slate-500 mb-5">Всё включено в любом тарифе</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {features.map((f, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-slate-700">
                  <Check className="w-4 h-4 text-green-600 shrink-0" />
                  {f}
                </div>
              ))}
            </div>

            {/* Yearly bonus */}
            <div className="mt-6 flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-sm px-4 py-3.5">
              <span className="shrink-0 w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center mt-0.5">
                <Sparkles className="w-4 h-4" />
              </span>
              <div>
                <p className="text-sm font-bold text-blue-800">При оплате за год</p>
                <p className="text-xs text-blue-600 mt-0.5">Миграция данных из любой системы — бесплатно</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
