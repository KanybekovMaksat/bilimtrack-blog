import { Gift, PackageOpen, RefreshCw, ShieldCheck } from "lucide-react";

const perks = [
  {
    icon: Gift,
    title: "3 месяца бесплатно",
    desc: "Без карты и обязательств — на любом тарифе.",
    color: "bg-blue-50 text-blue-600",
  },
  {
    icon: PackageOpen,
    title: "Переезд без головной боли",
    desc: "Перенесём данные из Excel или другой системы.",
    color: "bg-purple-50 text-purple-600",
  },
  {
    icon: RefreshCw,
    title: "Обновления всегда включены",
    desc: "Новые функции выходят автоматически, без доплат.",
    color: "bg-green-50 text-green-600",
  },
  {
    icon: ShieldCheck,
    title: "Данные в Кыргызстане",
    desc: "Серверы на территории КР. Всё под вашим контролем.",
    color: "bg-amber-50 text-amber-600",
  },
];

export function PerksSection() {
  return (
    <section className="py-10 md:py-14 bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {perks.map((perk, i) => (
            <div
              key={i}
              className="flex items-center gap-4 bg-white border border-neutral-100 rounded-2xl px-5 py-4 shadow-[0_1px_2px_0_rgba(0,0,0,.04)]"
            >
              <span className={`shrink-0 w-10 h-10 rounded-xl flex items-center justify-center ${perk.color}`}>
                <perk.icon className="w-5 h-5" />
              </span>
              <h3 className="text-sm font-semibold text-slate-900 leading-snug">{perk.title}</h3>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
