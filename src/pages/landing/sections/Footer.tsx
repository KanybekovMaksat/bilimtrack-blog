import { Separator } from "../ui-kit/separator";
import { Phone, Mail, MapPin } from "lucide-react";

export function Footer() {
  return (
    <footer className="border-t bg-slate-100/50">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center">
                <img src="/logo.svg" alt="" />
              </div>
              <span className="font-semibold text-xl">Bilimtrack</span>
            </div>
            <div className="space-y-2 text-sm text-slate-500">
              <a href="tel:+996600051151" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Phone className="h-4 w-4" />
                +996 600 051 151
              </a>
              <a href="mailto:bilimtrack@bashtup.com" className="flex items-center gap-2 hover:text-slate-900 transition-colors">
                <Mail className="h-4 w-4" />
                bilimtrack@bashtup.com
              </a>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Бишкек, Кыргызстан
              </div>
            </div>
          </div>

          <div>
            <h4 className="font-medium mb-4">Продукт</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#features" className="hover:text-slate-900 transition-colors">Возможности</a></li>
              <li><a href="#pricing" className="hover:text-slate-900 transition-colors">Тарифы</a></li>
              <li><a href="#testimonials" className="hover:text-slate-900 transition-colors">Отзывы</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-medium mb-4">Информация</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#how-we-work" className="hover:text-slate-900 transition-colors">Как мы работаем</a></li>
              <li><a href="tel:+996552077970" className="hover:text-slate-900 transition-colors">Связаться с нами</a></li>
            </ul>
          </div>


        </div>

        <Separator className="my-8" />

          <p className="text-sm text-slate-500">
            © 2026 Bilimtrack. Все права защищены.
          </p>
      </div>
    </footer>
  );
}