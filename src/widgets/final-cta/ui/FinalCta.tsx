import { Button, Icon } from "@/shared/ui";

/** Full-width conversion CTA at the end of an article (anchor #demo). */
export function FinalCta() {
  return (
    <section className="cta-final" id="demo">
      <div className="cta-final__inner">
        <span className="cta-final__proof">
          <Icon name="users" />
          Уже <b>340 организаций</b> перешли на Bilimtrack
        </span>
        <h2>
          Переведите свою организацию на цифровое управление — как это сделал
          МУИТ
        </h2>
        <p>
          Расписание, журнал, оплата и общение с родителями в одной системе.{" "}
          <span className="free">Первые 3 месяца — бесплатно.</span>
        </p>
        <div className="cta-final__actions">
          <Button href="#">
            Получить демо
            <Icon name="chevron-right" />
          </Button>
          <Button href="#" variant="outline">
            Посмотреть цены
          </Button>
        </div>
        <div className="cta-final__stats">
          <div className="cta-final__stat">
            <div className="num">340+</div>
            <span className="lbl">школ, колледжей и вузов</span>
          </div>
          <div className="cta-final__stat">
            <div className="num">−70%</div>
            <span className="lbl">бумажной отчётности</span>
          </div>
          <div className="cta-final__stat">
            <div className="num">2–3 дня</div>
            <span className="lbl">на сборку расписания</span>
          </div>
        </div>
      </div>
    </section>
  );
}
