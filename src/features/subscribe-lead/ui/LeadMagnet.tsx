import { useEffect, useState } from "react";

import { blogApi } from "@/shared/api/blog-api";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/lib";

interface LeadMagnetProps {
  /** Used to key the saved state per article. */
  slug: string;
  /** Article ID for sourceArticle field in demo request (optional). */
  articleId?: string;
}

const isValidEmail = (v: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());

/** Top-of-funnel checklist offer in exchange for an email / demo request. */
export function LeadMagnet({ slug, articleId }: LeadMagnetProps) {
  const storageKey = `bt_lead_${slug}`;

  const [email, setEmail] = useState("");
  const [invalid, setInvalid] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState(
    "Проверьте почту — письмо уже летит к вам.",
  );

  /**
   * `done` starts as false on both server and client (matching SSR).
   * We only ever set it to true inside useEffect (client-only),
   * which runs after hydration — eliminating the server/client mismatch.
   */
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Check localStorage only on client, after hydration is complete
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      setDone(true);
      setSuccessMsg(`Письмо отправлено на ${saved}. Проверьте почту.`);
    }
  }, [storageKey]);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const v = email.trim();

    if (!isValidEmail(v)) {
      setInvalid(true);
      return;
    }

    setIsLoading(true);
    try {
      await blogApi.submitDemoRequest({
        name: v,
        contact: v,
        organization: "—",
        source: "blog",
        ...(articleId ? { sourceArticle: articleId } : {}),
      });
    } catch (err) {
      // Non-blocking — save locally even if API fails
      console.warn("LeadMagnet submitDemoRequest failed (non-blocking):", err);
    } finally {
      setIsLoading(false);
      localStorage.setItem(storageKey, v);
      setSuccessMsg(`Письмо отправлено на ${v}. Проверьте почту.`);
      setDone(true);
    }
  };

  return (
    <aside className={cn("lead-magnet", done && "is-done")}>
      <div className="lead-magnet__main">
        <span className="lead-magnet__eyebrow">
          <Icon name="file-text" />
          Бесплатно · PDF
        </span>
        <h3>Чек-лист цифровизации школы: 7 шагов</h3>
        <ul className="lead-magnet__list">
          <li>
            <Icon name="check" />С чего начать разговор с командой и как снять
            сопротивление
          </li>
          <li>
            <Icon name="check" />
            Порядок запуска: расписание → журнал → оплата, без срыва учебного года
          </li>
          <li>
            <Icon name="check" />
            Какие метрики смотреть, чтобы увидеть результат уже в первом семестре
          </li>
        </ul>
      </div>

      <form
        noValidate
        className={cn("lead-magnet__form", invalid && "is-invalid")}
        onSubmit={submit}
      >
        <span className="lm-label">Пришлём на почту за минуту</span>
        <label
          className={cn("lead-magnet__field", invalid && "is-error")}
          htmlFor="leadEmail"
        >
          <Icon name="mail" />
          <input
            autoComplete="email"
            id="leadEmail"
            name="email"
            placeholder="Ваш e-mail"
            required
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setInvalid(false);
            }}
          />
        </label>
        <span className="lm-err">Введите корректный e-mail</span>
        <Button block type="submit" disabled={isLoading}>
          {isLoading ? "Отправляем..." : "Скачать чек-лист"}
          <Icon name="download" />
        </Button>
        <span className="lead-magnet__note">
          <Icon name="shield-check" />
          Без спама — только материалы Bilimtrack.
        </span>
      </form>

      <div className="lead-magnet__success">
        <span className="lm-check">
          <Icon name="check" />
        </span>
        <b>Готово! Чек-лист отправлен</b>
        <span>{successMsg}</span>
      </div>
    </aside>
  );
}
