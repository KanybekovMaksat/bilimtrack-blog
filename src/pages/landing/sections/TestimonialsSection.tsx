import { Card, CardContent } from "../ui-kit/card";
import { Avatar, AvatarFallback, AvatarImage } from "../ui-kit/avatar";

const testimonials = [
  {
    content: "Bilimtrack полностью изменил то, как мы организуем учебный процесс. Раньше это был хаос из Excel таблиц, теперь все в одном месте и доступно в пару кликов.",
    author: "Рамзан Малабакиев",
    role: "Директор",
    company: "Курсы программирования UstazTech",
    avatar: "РМ"
  },
  {
    content: "Как преподаватель, я наконец-то могу видеть полную картину по каждому студенту. Оценки, посещаемость, прогресс  все под рукой. Это экономит огромное количество времени.",
    author: "Саламат Канатбеков",
    role: "Преподаватель информатики",
    company: "Колледж КИТЭ",
    avatar: "СК"
  },
  {
    content: "Система отчётности в Bilimtrack помогла нам улучшить качество обучения. Мы видим проблемные места и можем оперативно реагировать на них.",
    author: "Гульбахор Ашимжановна",
    role: "Заведующая отделением",
    company: "Бишкекский колледж компьютерных систем и технологий",
    avatar: "ГА"
  }
];

export function TestimonialsSection() {
  return (
    <section id="testimonials" className="py-20 bg-slate-100/50">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="text-center mb-16">
                    <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight leading-[1.08]">
          
            Что о нас говорят?
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="h-full">
              <CardContent className="p-6">
                <blockquote className="text-sm mb-4">
                  "{testimonial.content}"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-blue-600 text-white">{testimonial.avatar}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-sm">{testimonial.author}</div>
                    <div className="text-xs text-slate-500">
                      {testimonial.role}, {testimonial.company}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}