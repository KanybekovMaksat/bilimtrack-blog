import { UserRound, School, Landmark } from "lucide-react";

const audiences = [
  {
    icon: UserRound,
    title: "Репетиторы и учебные центры",
    description:
      "Больше не нужно вести клиентов в блокноте, а оплату — в переписке. Bilimtrack заменяет Excel, WhatsApp и сервисы оплаты одним простым кабинетом.",
    meta: "от 5 учеников",
  },
  {
    icon: School,
    title: "Школы",
    description:
      "Учителя отмечают посещаемость за секунды, родители видят оценки в реальном времени, а директор контролирует всё заведение с одного экрана — без бумажных журналов и звонков.",
    meta: "от 50 учеников",
  },
  {
    icon: Landmark,
    title: "Университеты",
    description:
      "Управляйте факультетами, нагрузкой ППС и контрактами в одной системе. Деканат получает ведомости, студенты — личный кабинет, ректор — аналитику без ручных отчётов.",
    meta: "от 500 студентов",
  },
];

export function AudienceSection() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-16">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight leading-[1.08]">
            Для кого Bilimtrack
          </h2>
          <p className="mt-4 text-lg text-slate-500 leading-relaxed">
            Подстраивается под вашу структуру — от школы до университета.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 max-w-[460px] md:max-w-none mx-auto">
          {audiences.map((aud, i) => (
            <article
              key={i}
              className="flex items-center gap-3 p-4 border border-neutral-200 rounded-3xl bg-white transition-all duration-200 hover:shadow-[0_12px_32px_-12px_rgba(10,20,40,.16)] hover:-translate-y-1 hover:border-neutral-300"
            >
              <span className="w-[52px] h-[52px] rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center ">
                <aud.icon className="w-6 h-6" />
              </span>
              <h3 className="text-[18px] leading-5 font-bold">{aud.title}</h3>
              {/* <p className="mt-2.5 text-slate-500 text-sm leading-relaxed flex-1">{aud.description}</p> */}
              {/* <div className="mt-5 pt-4 border-t border-neutral-100 text-sm font-semibold text-blue-600">
                {aud.meta}
              </div> */}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
