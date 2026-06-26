import { useState } from "react";
import { Plus } from "lucide-react";

const faqs = [
  {
    q: "Нужно ли что-то устанавливать?",
    a: "Нет. Bilimtrack работает в браузере — телефон, планшет, компьютер.",
  },
  {
    q: "Что произойдёт с нашими данными при отмене?",
    a: "Данные принадлежат вам. При отмене выгружаем полный архив в Excel.",
  },
  {
    q: "Учителя смогут разобраться?",
    a: "Интерфейс учителя — одно окно: отметить посещаемость и поставить оценку. Обучение — 30 минут, проводим при внедрении.",
  },
  {
    q: "Работает ли на телефоне?",
    a: "Да. Полностью адаптивный интерфейс для всех ролей.",
  },
  {
    q: "Как считается количество учащихся?",
    a: "По количеству активных студентов на момент выставления счёта.",
  },
  {
    q: "Можно ли перенести данные из нашей текущей системы?",
    a: "Да. Переносим данные из Excel и большинства систем. Бесплатно.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number) {
    setOpenIndex((prev) => (prev === i ? null : i));
  }

  return (
    <section className="py-10 md:py-16 bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-14">
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight leading-[1.08]">
            Частые вопросы
          </h2>
        </div>

        <div className="flex flex-col gap-3">
          {faqs.map((faq, i) => {
            const open = openIndex === i;
            return (
              <div
                key={i}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden"
              >
                <button
                  onClick={() => toggle(i)}
                  className="w-full flex items-center gap-4 px-5 md:px-6 py-5 text-left text-base md:text-[17px] font-semibold"
                >
                  <span className="flex-1 leading-snug">{faq.q}</span>
                  <Plus
                    className="shrink-0 w-5 h-5 text-slate-400 transition-transform duration-200"
                    style={{ transform: open ? "rotate(45deg)" : "rotate(0deg)" }}
                  />
                </button>
                {open && (
                  <div className="px-5 md:px-6 pb-5 text-slate-500 text-[15.5px] leading-relaxed max-w-[68ch]">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
