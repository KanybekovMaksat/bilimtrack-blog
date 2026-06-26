import { Button } from '../ui-kit/button';
import { Badge } from '../ui-kit/badge';
import {
  ArrowRight,
  Phone,
  Rocket,
  Users,
  Calendar,
  Trophy,
  Medal,
  Award,
  ClipboardCheck,
  GraduationCap,
  Settings,
  BarChart3,
  CheckSquare,
  type LucideIcon
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingCard {
  icon: LucideIcon;
  label: string;
  // Desktop position (percentage-based)
  desktop: { top?: string; bottom?: string; left?: string; right?: string };
  content: React.ReactNode;
}

const floatingCards: FloatingCard[] = [
  {
    icon: Users,
    label: "Студенты",
    desktop: { top: "8%", left: "3%" },
    content: (
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-blue-500 rounded-full"></div>
          <div className="h-1.5 bg-slate-100 rounded flex-1"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 bg-indigo-500 rounded-full"></div>
          <div className="h-1.5 bg-slate-100 rounded flex-1"></div>
        </div>
      </div>
    )
  },
  {
    icon: Calendar,
    label: "Расписание",
    desktop: { top: "5%", right: "5%" },
    content: (
      <div className="space-y-1">
        <div className="flex gap-1">
          <div className="w-6 h-4 bg-blue-100 dark:bg-blue-900/30 rounded text-[7px] flex items-center justify-center">ПН</div>
          <div className="w-6 h-4 bg-blue-100 dark:bg-blue-900/30 rounded text-[7px] flex items-center justify-center">ВТ</div>
          <div className="w-6 h-4 bg-blue-100 dark:bg-blue-900/30 rounded text-[7px] flex items-center justify-center">СР</div>
        </div>
        <div className="h-1.5 bg-blue-500 rounded w-full"></div>
        <div className="h-1.5 bg-indigo-500 rounded w-3/4"></div>
      </div>
    )
  },
  {
    icon: Trophy,
    label: "Рейтинг",
    desktop: { bottom: "12%", left: "2%" },
    content: (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <Medal className="h-3.5 w-3.5 text-yellow-500" />
          <div className="h-1.5 bg-yellow-400 rounded flex-1"></div>
          <span className="text-[9px] font-semibold">950</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-gray-400" />
          <div className="h-1.5 bg-gray-300 rounded flex-1 w-4/5"></div>
          <span className="text-[9px] font-semibold">820</span>
        </div>
      </div>
    )
  },
  {
    icon: ClipboardCheck,
    label: "Домашние задания",
    desktop: { bottom: "8%", right: "3%" },
    content: (
      <div className="space-y-1.5">
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 border-2 border-green-500 rounded flex items-center justify-center text-[7px] text-green-500">✓</div>
          <div className="h-1.5 bg-slate-100 rounded flex-1"></div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 border-2 border-green-500 rounded flex items-center justify-center text-[7px] text-green-500">✓</div>
          <div className="h-1.5 bg-slate-100 rounded flex-1"></div>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3.5 h-3.5 border-2 border-orange-400 rounded"></div>
          <div className="h-1.5 bg-slate-100 rounded flex-1"></div>
        </div>
      </div>
    )
  },
  {
    icon: GraduationCap,
    label: "Преподаватели",
    desktop: { top: "25%", right: "15%" },
    content: (
      <div className="flex gap-1">
        <div className="w-7 h-7 bg-blue-500 rounded-full"></div>
        <div className="w-7 h-7 bg-indigo-500 rounded-full"></div>
        <div className="w-7 h-7 bg-purple-500 rounded-full"></div>
      </div>
    )
  },
  {
    icon: BarChart3,
    label: "Оценки",
    desktop: { top: "30%", left: "8%" },
    content: (
      <div className="space-y-1.5">
        <div className="flex justify-between items-center">
          <span className="text-[9px]">Математика</span>
          <span className="text-[10px] font-semibold text-green-600">5</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-[9px]">Физика</span>
          <span className="text-[10px] font-semibold text-blue-600">4</span>
        </div>
      </div>
    )
  },
  {
    icon: Settings,
    label: "Админ-панель",
    desktop: { bottom: "28%", left: "12%" },
    content: (
      <div className="space-y-1">
        <div className="h-1.5 bg-blue-500 rounded w-full"></div>
        <div className="h-1.5 bg-indigo-500 rounded w-3/4"></div>
        <div className="h-1.5 bg-purple-500 rounded w-5/6"></div>
      </div>
    )
  },
  {
    icon: CheckSquare,
    label: "Посещаемость",
    desktop: { bottom: "30%", right: "10%" },
    content: (
      <div>
        <div className="flex gap-1 mb-1.5">
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <div className="w-3 h-3 bg-green-500 rounded"></div>
          <div className="w-3 h-3 bg-yellow-500 rounded"></div>
          <div className="w-3 h-3 bg-red-500 rounded"></div>
        </div>
        <div className="text-[9px] text-slate-500">85% за неделю</div>
      </div>
    )
  }
];



export function HeroSection() {
  const sceneRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const cards = scene.querySelectorAll('.floating-card');

    let animationId: number;
    const animateCards = () => {
      cards.forEach((card, index) => {
        const element = card as HTMLElement;
        const time = Date.now() * 0.001;
        const offset = index * 0.7;
        const x = Math.sin(time + offset) * 15;
        const y = Math.cos(time + offset * 1.3) * 10;
        const rotate = Math.sin(time * 0.5 + offset) * 3;

        element.style.transform = `translate(${x}px, ${y}px) rotate(${rotate}deg)`;
      });

      animationId = requestAnimationFrame(animateCards);
    };

    animateCards();
    return () => cancelAnimationFrame(animationId);
  }, []);

  return (
    <section className="relative py-12 lg:py-30 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-blue-500/10 blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[10%] right-[-5%] w-[30%] h-[30%] rounded-full bg-indigo-500/10 blur-[100px] animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-[20%] right-[10%] w-[20%] h-[20%] rounded-full bg-purple-500/5 blur-[80px]"></div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16 relative z-10 text-center">

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mx-auto max-w-4xl text-5xl md:text-6xl  lg:text-7xl font-medium tracking-tight mb-8 leading-15"
        >
          Ваше заведение —{' '}
          <span className="text-gradient">
            полностью цифровое
          </span>{' '}
          за одну неделю
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mx-auto max-w-2xl text-lg md:text-xl text-slate-500 mb-10 leading-relaxed opacity-90"
        >
          Подключим, обучим, оцифруем. Вам не нужно ничего настраивать самим.
        </motion.p>

        {/* <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-16"
        >
          <Button
            size="lg"
            className="w-full sm:w-auto h-14 px-8 text-lg font-bold bg-blue-600 hover:bg-blue-600/90 shadow-xl shadow-blue-600/20 border-0 rounded-2xl"
            asChild
          >
            <a href="tel:+996552077970">
              <Phone className="mr-2 h-5 w-5" />
              Позвонить нам
            </a>
          </Button>
          <Button variant="secondary" size="lg" className="w-full sm:w-auto h-14 px-8 text-lg font-bold glass shadow-lg border-blue-600/10 rounded-2xl text-blue-600" asChild>
            <a href="#pricing">
              Посмотреть тарифы
              <ArrowRight className="ml-2 h-5 w-5" />
            </a>
          </Button>
        </motion.div> */}




  
          {/* <div className="hidden lg:block relative mx-auto max-w-5xl h-[550px]">
            <div
              ref={sceneRef}
              className="relative w-full h-full"
            >

              <motion.div 
                initial={{ scale: 0, rotate: -20 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', damping: 15, stiffness: 100, delay: 0.4 }}
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 rounded-[2.5rem] bg-white dark:bg-slate-900 shadow-[0_20px_50px_rgba(37,99,235,0.2)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.5)] border-4 border-blue-600/10 flex items-center justify-center z-20 overflow-hidden"
              >
                <img src="/logo.svg" className="w-16 h-16" alt="Bilimtrack" />
              </motion.div>

    
              {floatingCards.map((card, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: 0.5 + index * 0.05 }}
                  className="floating-card absolute w-44 glass border-white/40 dark:border-slate-800/40 rounded-2xl shadow-[0_10px_25px_rgba(0,0,0,0.05)] p-4 transform-gpu transition-all duration-300 hover:shadow-2xl hover:border-blue-600/30 z-10"
                  style={{
                    ...card.desktop,
                  }}
                >
                  <div className="text-[11px] font-bold text-blue-600 mb-3 flex items-center gap-2 opacity-80 uppercase tracking-tight">
                    <div className="bg-blue-600/10 p-1 rounded-md">
                      <card.icon className="h-3.5 w-3.5" />
                    </div>
                    {card.label}
                  </div>
                  <div className="opacity-90">
                    {card.content}
                  </div>
                </motion.div>
              ))}

    
              <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.03] dark:opacity-[0.07]">
                <line x1="50%" y1="50%" x2="15%" y2="15%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <line x1="50%" y1="50%" x2="85%" y2="12%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <line x1="50%" y1="50%" x2="10%" y2="80%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <line x1="50%" y1="50%" x2="88%" y2="78%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <line x1="50%" y1="50%" x2="20%" y2="35%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <line x1="50%" y1="50%" x2="80%" y2="30%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <line x1="50%" y1="50%" x2="22%" y2="65%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
                <line x1="50%" y1="50%" x2="82%" y2="65%" stroke="currentColor" strokeWidth="2" strokeDasharray="8 8" />
              </svg>

    
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(20)].map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1.5 h-1.5 bg-blue-600/20 rounded-full animate-pulse"
                    style={{
                      left: `${5 + Math.random() * 90}%`,
                      top: `${5 + Math.random() * 90}%`,
                      animationDelay: `${Math.random() * 5}s`,
                      animationDuration: `${3 + Math.random() * 4}s`,
                    }}
                  />
                ))}
              </div>
            </div>
          </div> */}
      </div>
    </section>
  );
}

