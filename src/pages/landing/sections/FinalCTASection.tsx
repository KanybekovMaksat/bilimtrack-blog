import { useState, useEffect } from "react";
import { ArrowRight, Check, Loader2 } from "lucide-react";

const API_BASE = ""; // use Next.js rewrite proxy (/api/v1/* -> api.bilimtrack.com)

interface Choice {
  value: string;
  label: string;
}

interface FormState {
  name: string;
  contact: string;
  organizationName: string;
  studentCountRange: string;
}

interface FieldErrors {
  name?: string;
  contact?: string;
  organizationName?: string;
  general?: string;
}

function validateContact(v: string) {
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
  const isPhone = /[0-9]/.test(v) && v.replace(/[^0-9]/g, "").length >= 6;
  return isEmail || isPhone;
}

function clientValidate(form: FormState): FieldErrors {
  const errors: FieldErrors = {};
  if (form.name.trim().length < 2) errors.name = "Укажите имя";
  if (!validateContact(form.contact)) errors.contact = "Укажите телефон или email";
  if (form.organizationName.trim().length < 2) errors.organizationName = "Укажите организацию";
  return errors;
}

export function FinalCTASection() {
  const [form, setForm] = useState<FormState>({
    name: "",
    contact: "",
    organizationName: "",
    studentCountRange: "",
  });
  const [errors, setErrors] = useState<FieldErrors>({});
  const [choices, setChoices] = useState<Choice[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    fetch(`${API_BASE}/api/v1/leads/demo-request/choices/`)
      .then((r) => r.json())
      .then((json) => setChoices(Array.isArray(json) ? json : (json.data ?? [])))
      .catch(() => {});
  }, []);

  function handleChange(field: keyof FormState, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const clientErrors = clientValidate(form);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const res = await fetch(`${API_BASE}/api/v1/leads/demo-request/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.status === 201) {
        setSubmitted(true);
        return;
      }

      if (res.status === 400) {
        const body = await res.json();
        const fieldErrors: FieldErrors = {};
        for (const err of body.errors ?? []) {
          fieldErrors[err.attr as keyof FieldErrors] = err.detail;
        }
        setErrors(fieldErrors);
        return;
      }

      setErrors({ general: "Что-то пошло не так. Попробуйте ещё раз." });
    } catch {
      setErrors({ general: "Нет соединения. Проверьте интернет и попробуйте снова." });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section id="demo" className="py-10 md:py-16 bg-white">
      <div className="max-w-[1200px] mx-auto px-5 md:px-10 lg:px-16">
        <div
          className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center rounded-[32px] px-8 md:px-12 lg:px-16 py-10 md:py-14 overflow-hidden relative"
          style={{
            background: "linear-gradient(135deg,#1a66ff,#1450e6)",
            color: "#fff",
            boxShadow: "0 12px 32px -12px rgba(10,20,40,.16)",
          }}
        >
          {/* Decorative circle */}
          <div
            className="absolute right-[-120px] top-[-120px] w-[340px] h-[340px] rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle,rgba(255,255,255,.16),transparent 70%)" }}
          />

          {/* Copy */}
          <div className="relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight leading-tight text-white">
              Начните с бесплатных 3 месяцев
            </h2>
            <p className="mt-4 text-[17px] leading-relaxed" style={{ color: "rgba(255,255,255,.82)" }}>
              Покажем систему на примере вашей организации. Без обязательств. 
            </p>
          </div>

          {/* Form */}
          <div className="relative z-10 bg-white rounded-2xl p-6 md:p-8 text-slate-900">
            {submitted ? (
              <div className="text-center py-4">
                <div className="w-16 h-16 rounded-full bg-green-50 text-green-600 flex items-center justify-center mx-auto mb-4">
                  <Check className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold">Заявка отправлена</h3>
                <p className="mt-2 text-slate-500 text-sm">
                  Свяжемся с вами в течение 2 часов в рабочее время.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} noValidate>
                <Field
                  label="Имя"
                  id="f-name"
                  type="text"
                  placeholder="Как к вам обращаться"
                  value={form.name}
                  onChange={(v) => handleChange("name", v)}
                  error={errors.name}
                />
                <Field
                  label="Телефон или email"
                  id="f-contact"
                  type="text"
                  placeholder="+996 700 000 000"
                  value={form.contact}
                  onChange={(v) => handleChange("contact", v)}
                  error={errors.contact}
                />
                <Field
                  label="Организация"
                  id="f-org"
                  type="text"
                  placeholder="Название организации"
                  value={form.organizationName}
                  onChange={(v) => handleChange("organizationName", v)}
                  error={errors.organizationName}
                />



                {errors.general && (
                  <p className="mb-3 text-[12.5px] text-red-500 text-center">{errors.general}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className="mt-1 w-full flex items-center justify-center gap-2 rounded-full bg-blue-600 text-white font-semibold px-6 py-4 text-base hover:bg-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Отправляем…</>
                  ) : (
                    <>Получить демо <ArrowRight className="w-4 h-4" /></>
                  )}
                </button>
                <p className="mt-3 text-center text-[12.5px] text-slate-400">
                  Свяжемся в течение 2 часов в рабочее время
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

interface FieldProps {
  label: string;
  id: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (v: string) => void;
  error?: string;
}

function Field({ label, id, type, placeholder, value, onChange, error }: FieldProps) {
  return (
    <div className="mb-3.5">
      <label htmlFor={id} className="block text-xs font-semibold text-slate-500 mb-1.5">
        {label}
      </label>
      <input
        id={id}
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full font-[inherit] text-sm rounded-xl px-4 py-3 transition-colors border ${
          error
            ? "border-red-500 bg-white"
            : "border-transparent bg-neutral-100 focus:bg-white focus:border-slate-700"
        } focus:outline-none placeholder:text-slate-400`}
      />
      {error && <p className="mt-1 text-[12.5px] text-red-500">{error}</p>}
    </div>
  );
}
