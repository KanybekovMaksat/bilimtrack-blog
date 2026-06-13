import { useState, type FormEvent } from "react";
import { blogApi } from "@/shared/api/blog-api";
import { Button, Icon } from "@/shared/ui";

type OrgType = "school" | "college" | "university" | "other";
type StudentsCount = "lt100" | "100_300" | "300_1000" | "gt1000";

interface DemoForm {
  name: string;
  contact: string;
  organization: string;
  orgType: OrgType;
  studentsCount: StudentsCount;
}

const ORG_TYPE_OPTIONS: { value: OrgType; label: string }[] = [
  { value: "school", label: "Школа" },
  { value: "college", label: "Колледж" },
  { value: "university", label: "Университет" },
  { value: "other", label: "Другое" },
];

const STUDENTS_OPTIONS: { value: StudentsCount; label: string }[] = [
  { value: "lt100", label: "до 100" },
  { value: "100_300", label: "100–300" },
  { value: "300_1000", label: "300–1000" },
  { value: "gt1000", label: "свыше 1000" },
];

/** Full-width conversion CTA with demo request form (anchor #demo). */
export function FinalCta() {
  const [form, setForm] = useState<DemoForm>({
    name: "",
    contact: "",
    organization: "",
    orgType: "school",
    studentsCount: "100_300",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isDone, setIsDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.contact.trim() || !form.organization.trim()) {
      setError("Пожалуйста, заполните все обязательные поля.");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const res = await blogApi.submitDemoRequest({
        name: form.name.trim(),
        contact: form.contact.trim(),
        organization: form.organization.trim(),
        orgType: form.orgType,
        studentsCount: form.studentsCount,
        source: "blog",
      });

      // API returns { data: { message: "..." } } on success
      if (res?.data?.message || res?.data || res?.message) {
        setIsDone(true);
      } else if (res?.type === "validation_error" && res?.errors?.length) {
        const msg = res.errors.map((e: any) => e.detail).join(", ");
        setError(msg);
      } else {
        setIsDone(true); // treat as success if no explicit error
      }
    } catch (err) {
      console.error("submitDemoRequest failed:", err);
      setError("Ошибка сети. Попробуйте позже или свяжитесь с нами напрямую.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="cta-final" id="demo">
      <div className="cta-final__inner">
        <span className="cta-final__proof">
          <Icon name="users" />
          Уже <b>340 организаций</b> перешли на Bilimtrack
        </span>
        <h2>
          Переведите свою организацию на цифровое управление
        </h2>
        <p>
          Расписание, журнал, оплата и общение с родителями в одной системе.{" "}
          <span className="free">Первые 3 месяца — бесплатно.</span>
        </p>

        {isDone ? (
          <div className="cta-final__success">
            <Icon name="check" />
            <b>Заявка принята!</b>
            <span>Мы свяжемся с вами в течение 2 часов.</span>
          </div>
        ) : (
          <form className="cta-final__form" onSubmit={handleSubmit} noValidate>
            {error && (
              <div className="cta-final__error">⚠️ {error}</div>
            )}
            <div className="cta-final__fields">
              <input
                name="name"
                type="text"
                required
                placeholder="Ваше имя *"
                value={form.name}
                onChange={handleChange}
                className="cta-final__input"
              />
              <input
                name="contact"
                type="text"
                required
                placeholder="Телефон или e-mail *"
                value={form.contact}
                onChange={handleChange}
                className="cta-final__input"
              />
              <input
                name="organization"
                type="text"
                required
                placeholder="Название организации *"
                value={form.organization}
                onChange={handleChange}
                className="cta-final__input"
              />
              <select
                name="orgType"
                value={form.orgType}
                onChange={handleChange}
                className="cta-final__input"
              >
                {ORG_TYPE_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
              <select
                name="studentsCount"
                value={form.studentsCount}
                onChange={handleChange}
                className="cta-final__input"
              >
                {STUDENTS_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label} учащихся
                  </option>
                ))}
              </select>
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Отправляем..." : "Получить демо"}
              <Icon name="chevron-right" />
            </Button>
          </form>
        )}

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

      <style>{`
        .cta-final__form { display: flex; flex-direction: column; gap: 12px; max-width: 480px; margin: 24px auto; }
        .cta-final__fields { display: flex; flex-direction: column; gap: 10px; }
        .cta-final__input {
          width: 100%; padding: 10px 16px; border-radius: 9999px;
          border: 1px solid rgba(255,255,255,0.25); background: rgba(255,255,255,0.1);
          color: inherit; font-size: 14px; outline: none; box-sizing: border-box;
        }
        .cta-final__input::placeholder { color: rgba(255,255,255,0.55); }
        .cta-final__input:focus { border-color: rgba(255,255,255,0.6); background: rgba(255,255,255,0.18); }
        .cta-final__error {
          background: rgba(251,44,54,0.15); border: 1px solid rgba(251,44,54,0.3);
          color: #fff; border-radius: 8px; padding: 10px 14px; font-size: 13px;
        }
        .cta-final__success {
          display: flex; flex-direction: column; align-items: center; gap: 8px;
          padding: 24px; color: #fff; font-size: 16px;
        }
        .cta-final__success svg { width: 32px; height: 32px; }
      `}</style>
    </section>
  );
}
