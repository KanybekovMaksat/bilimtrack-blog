import { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import {
  BarChart2,
  Building2,
  Banknote,
  Bell,
  Users,
  UserCheck,
  Pencil,
  CalendarDays,
  MessageCircle,
  TrendingUp,
  ShieldCheck,
  Activity,
  BookOpen,
  Wallet,
  ClipboardList,
  UserCog,
  type LucideIcon,
} from 'lucide-react';

interface Feat {
  icon: LucideIcon;
  text: string;
}

interface Role {
  key: string;
  img: string;
  label: string;
  subtitle: string;
  features: Feat[];
}

const roles: Role[] = [
  {
    key: 'director',
    img: '/ceo.png',
    label: 'Директор',
    subtitle: 'Вся организация — на одном экране, без ручных отчётов.',
    features: [
      { icon: Activity,    text: 'Ключевые метрики в реальном времени' },
      { icon: Building2,   text: 'Гибкая настройка под ваше заведение' },
      { icon: Banknote,    text: 'Задолженности и финансовый обзор' },
      { icon: TrendingUp,  text: 'Тренды и динамика успеваемости' },
      { icon: UserCog,     text: 'Создание ролей и управление доступом' },
      { icon: BarChart2,   text: 'Повышение репутации вашего заведения' },
    ],
  },
  {
    key: 'teacher',
    img: '/mentor.png',
    label: 'Учитель',
    subtitle: 'Одно окно: отметить посещаемость и поставить оценку.',
    features: [
      { icon: UserCheck,     text: 'Отметка посещаения за минуту' },
      { icon: Pencil,        text: 'Оценки и задания в одном окне' },
      { icon: MessageCircle, text: 'Связь с родителями без личных чатов' },
      { icon: BookOpen,      text: 'Темы уроков и учебные материалы' },
      { icon: TrendingUp,    text: 'Прогресс каждого студента' },
    ],
  },
  {
    key: 'parent',
    img: '/parent.png',
    label: 'Родитель',
    subtitle: 'Успеваемость ребёнка — в телефоне, в любое время.',
    features: [
      { icon: TrendingUp,    text: 'Оценки и посещаемость онлайн' },
      { icon: ClipboardList, text: 'Расписание и домашние задания' },
      { icon: Wallet,        text: 'Оплата и история платежей' },
      { icon: Bell,          text: 'Уведомления о важных событиях' },
      { icon: MessageCircle, text: 'Связь с учителем напрямую' },
    ],
  },
];

export function FeaturesSection() {
  const [activeKey, setActiveKey] = useState('director');
  const role = roles.find((r) => r.key === activeKey) ?? roles[0];

  useEffect(() => {
    roles.forEach((r) => {
      const img = new Image();
      img.src = r.img;
    });
  }, []);

  return (
    <section id="product" className="py-10 md:py-10 bg-neutral-50">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">
        <div className="text-center max-w-[760px] mx-auto mb-10 md:mb-14">
          <p className="text-blue-600 text-sm font-semibold uppercase tracking-widest mb-3">
            Функции платформы Bilimtrack
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-[48px] font-bold tracking-tight leading-[1.08]">
            Всё необходимое — в одном месте
          </h2>
          <p className="mt-4 text-slate-500 text-base md:text-lg leading-relaxed">
            Это лишь часть возможностей платформы. Выберите роль, чтобы увидеть, как Bilimtrack упрощает работу каждого участника учебного процесса.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 justify-center flex-wrap mb-8 md:mb-11">
          {roles.map((r) => (
            <button
              key={r.key}
              onClick={() => setActiveKey(r.key)}
              className={`border rounded-full px-5 py-[11px] text-sm font-semibold transition-colors duration-150 ${
                activeKey === r.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-slate-500 border-neutral-200 hover:text-slate-800'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-12 lg:gap-16 items-center">

          {/* Mobile-only: role name + subtitle above image */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey + '-header'}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="md:hidden order-1"
            >
              <h3 className="text-2xl font-semibold tracking-tight leading-[1.18]">
                {role.label}
              </h3>
              <p className="mt-1.5 text-slate-500">{role.subtitle}</p>
            </motion.div>
          </AnimatePresence>

          {/* Image */}
          <div className="order-2 md:order-1 relative flex justify-center">
            <AnimatePresence mode="wait">
              <motion.img
                key={activeKey}
                src={role.img}
                alt={role.label}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="w-full max-w-[340px] md:max-w-none rounded-2xl object-cover"
              />
            </AnimatePresence>
          </div>

          {/* Feature cards — on desktop also shows role name */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeKey}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="order-3 md:order-2"
            >
              <h3 className="hidden md:block text-2xl md:text-[30px] font-semibold tracking-tight leading-[1.18]">
                {role.label}
              </h3>
              <p className="hidden md:block mt-2 text-slate-500 mb-6">{role.subtitle}</p>

              <div className="grid grid-cols-2 gap-3">
                {role.features.map((feat, i) => (
                  <div
                    key={i}
                    className="flex items-start gap-3 bg-white border border-neutral-100 rounded-xl p-3.5 shadow-[0_1px_2px_0_rgba(0,0,0,.04)]"
                  >
                    <span className="shrink-0 w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mt-0.5">
                      <feat.icon className="w-4 h-4" />
                    </span>
                    <p className="text-[13.5px] font-medium leading-snug text-slate-700 pt-1">
                      {feat.text}
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-6">
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 text-blue-600 font-semibold text-sm px-6 py-3 hover:bg-blue-100 transition-colors"
                >
                  Посмотреть демо <ArrowRight className="w-4 h-4" />
                </a>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
