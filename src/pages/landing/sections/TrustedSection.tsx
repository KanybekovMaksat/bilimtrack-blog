const orgs = [
  {
    initials: "МУ",
    name: "МУИТ",
    meta: "Международный университет информационных технологий",
    logo: "/intuit-logo.png",
    href: "https://intuit.kg",
  },
  {
    initials: "C",
    name: "Comtehno",
    meta: "Бишкекский колледж компьютерных систем и технологий",
    logo: "/comtehno.png",
    href: "https://comtehno.kg",
  },
  {
    initials: "K",
    name: "ITEC",
    meta: "Колледж Инновационных Технологий и Экономики",
    logo: "/itec.png",
    href: "https://itec.kg",
  },
  {
    initials: "UT",
    name: "Ustaz Tech",
    meta: "Образовательные айти курсы",
    logo: "",
    href: "https://instagram.com/ustaz.tech",
  },
];

export function TrustedSection() {
  return (
    <section id="trusted" className="py-14 md:py-20 bg-white border-y border-neutral-100">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">
          <h2 className="text-3xl md:text-4xl text-center lg:text-[48px] font-bold tracking-tight leading-[1.08] mb-5">
          
           Наши партнеры
          </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {orgs.map((org, i) => {
            const Tag = org.href ? "a" : "div";
            const linkProps = org.href
              ? { href: org.href, target: "_blank", rel: "noopener noreferrer" }
              : {};
            return (
              <Tag
                key={i}
                {...linkProps}
                className="flex items-center gap-4 bg-white border border-neutral-200 rounded-2xl px-1 py-4 shadow-[0_1px_2px_0_rgba(0,0,0,.04)] transition-all duration-150 hover:border-blue-200 hover:shadow-[0_4px_16px_-4px_rgba(0,0,0,.10)]"
              >
                <div className="shrink-0 w-12 h-12 rounded-xl bg-blue-900 border border-blue-100 flex items-center justify-center overflow-hidden">
                  {org.logo ? (
                    <img src={org.logo} alt={org.name} className="w-full h-full object-contain p-1" />
                  ) : (
                    <span className="text-base font-extrabold text-white tracking-tight">
                      {org.initials}
                    </span>
                  )}
                </div>
                <div className="min-w-0">
                  <div className="font-bold text-sm text-slate-900 truncate">{org.name}</div>
                  <div className="text-xs text-slate-400 mt-0.5 leading-snug">{org.meta}</div>
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </section>
  );
}
