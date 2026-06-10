import { Icon } from "@/shared/ui";

interface BlogHeroProps {
  inputValue: string;
  onSearch: (value: string) => void;
  onTopic: (label: string, term: string) => void;
  /** Live count of articles (shown in the stat card). */
  articleCount: number;
}

const TOPICS: { label: string; term: string }[] = [
  { label: "Расписание", term: "расписание" },
  { label: "Электронный журнал", term: "журнал" },
  { label: "Онлайн-оплата", term: "оплат" },
  { label: "Метрики директора", term: "метрик" },
];

/** Knowledge-hub masthead with working search, topic shortcuts and proof. */
export function BlogHero({
  inputValue,
  onSearch,
  onTopic,
  articleCount,
}: BlogHeroProps) {
  return (
    <section className="home-hero">
      <div className="home-hero__main">
        <h1>
          Блог об <span style={{ color: '#155DFC' }}>образовании</span> будущего
        </h1>
        <p className="home-hero__lead">
          Рассказываем как технологии меняют образование и как использовать их
          в своей работе  
        </p>
        <form
          className="home-search"
          role="search"
          onSubmit={(e) => e.preventDefault()}
        >
          <Icon name="search" />
          <input
            aria-label="Поиск по статьям"
            autoComplete="off"
            placeholder="Поиск статей"
            type="search"
            value={inputValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </form>
        {/* <div className="home-topics">
          <span className="home-topics__label">Популярные темы:</span>
          {TOPICS.map((t) => (
            <a
              key={t.term}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                onTopic(t.label, t.term);
              }}
            >
              {t.label}
            </a>
          ))}
        </div> */}
      </div>
    </section>
  );
}
