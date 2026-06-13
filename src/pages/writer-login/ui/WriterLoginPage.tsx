import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import { cmsApi } from "@/shared/api/blog-api";

/** CMS login page for writer panel. */
export function WriterLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const res = await cmsApi.login({ username: email, password });
      
      // Match backend response structure: { data: { access: "...", refresh: "..." } }
      if (res && res.data && res.data.access) {
        localStorage.setItem("cms_token", res.data.access);
        if (res.data.refresh) {
          localStorage.setItem("cms_refresh_token", res.data.refresh);
        }
        router.push("/writer/admin");
      } else {
        const errorMsg = res.detail || res.error || "Неверный логин или пароль";
        setError(errorMsg);
      }
    } catch (err) {
      console.error(err);
      setError("Ошибка сети. Проверьте соединение с сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Вход в CMS — Bilimtrack</title>
      </Head>
      <div 
        className="flex min-h-screen items-center justify-center p-6"
        style={{ backgroundColor: "var(--surface-app)" }}
      >
        <div 
          className="w-full max-w-md rounded-2xl border p-8 shadow-sm transition-all duration-300 hover:shadow-md"
          style={{ 
            backgroundColor: "var(--surface-lowest)", 
            borderColor: "rgba(0, 0, 0, 0.08)" 
          }}
        >
          <div className="mb-8 flex flex-col items-center">
            <img
              alt="Bilimtrack Logo"
              src="/logo-mark.png"
              className="mb-4 h-12 w-12"
            />
            <h1 
              className="text-2xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              Панель управления
            </h1>
            <p 
              className="mt-1.5 text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              Войдите, чтобы управлять блогом Bilimtrack
            </p>
          </div>

          {error && (
            <div 
              className="mb-6 rounded-lg p-3 text-sm font-medium border"
              style={{ 
                backgroundColor: "rgba(251, 44, 54, 0.06)", 
                color: "var(--text-error)",
                borderColor: "rgba(251, 44, 54, 0.15)"
              }}
            >
              ⚠️ {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label 
                htmlFor="email"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Email или Логин
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="admin@bilimtrack.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none border transition-colors focus:border-blue-500"
                style={{ 
                  backgroundColor: "var(--surface-middle)", 
                  borderColor: "rgba(0, 0, 0, 0.08)",
                  color: "var(--text-primary)"
                }}
              />
            </div>

            <div>
              <label 
                htmlFor="password"
                className="mb-1.5 block text-xs font-semibold uppercase tracking-wider"
                style={{ color: "var(--text-muted)" }}
              >
                Пароль
              </label>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none border transition-colors focus:border-blue-500"
                style={{ 
                  backgroundColor: "var(--surface-middle)", 
                  borderColor: "rgba(0, 0, 0, 0.08)",
                  color: "var(--text-primary)"
                }}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="mt-2 w-full cursor-pointer rounded-lg py-2.5 text-sm font-semibold transition-opacity hover:opacity-90 disabled:opacity-50"
              style={{ 
                backgroundColor: "var(--text-brand)", 
                color: "var(--text-on-solid)" 
              }}
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
