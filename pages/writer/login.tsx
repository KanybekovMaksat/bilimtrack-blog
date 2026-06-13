import { useState, type FormEvent } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { cmsApi } from "@/shared/api/blog-api";

/**
 * CMS login page for the writer panel.
 *
 * Flow:
 *  1. POST /auth/login/ with username + password
 *  2. If server returns { data: { access, refresh } } → save to localStorage & redirect
 *  3. Fire-and-forget GET /users/me/ for debug only — never blocks the redirect
 *  4. On error → show human-readable message
 */
export default function WriterLoginPage() {
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

      // Spec: { "data": { "access": "eyJ...", "refresh": "eyJ..." } }
      // Some setups return flat { access, refresh } — handle both
      const tokenData = res?.data ?? res;

      if (tokenData?.access) {
        const accessToken: string = tokenData.access;
        const refreshToken: string | undefined = tokenData.refresh;

        // ✅ Tokens received — server confirmed auth. Save & redirect immediately.
        localStorage.setItem("cms_token", accessToken);
        if (refreshToken) {
          localStorage.setItem("cms_refresh_token", refreshToken);
        }

        // 🔍 Fire-and-forget profile check (debug only, never blocks UX)
        fetch("https://api.bilimtrack.com/api/v1/users/me/", {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        })
          .then((r) => r.json())
          .then((profile) =>
            console.log("=== DEBUG /users/me/ ===", profile)
          )
          .catch((err) =>
            console.warn("=== DEBUG /users/me/ failed (non-blocking) ===", err)
          );

        // Redirect to admin — do not await getMe
        router.push("/writer/admin");
      } else {
        // Login failed — extract Django error message
        const errData = res?.data ?? res;
        let msg = "Неверный логин или пароль";

        if (typeof errData?.detail === "string") {
          msg = errData.detail;
        } else if (typeof errData?.error === "string") {
          msg = errData.error;
        } else if (Array.isArray(errData?.non_field_errors)) {
          msg = errData.non_field_errors.join(", ");
        } else if (Array.isArray(errData?.username)) {
          msg = `Логин: ${errData.username.join(", ")}`;
        } else if (Array.isArray(errData?.password)) {
          msg = `Пароль: ${errData.password.join(", ")}`;
        }

        console.log("=== DEBUG login failed ===", res);
        setError(msg);
      }
    } catch (err) {
      console.error("=== DEBUG login exception ===", err);
      setError("Ошибка сети. Проверьте соединение с сервером.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Вход в CMS — Bilimtrack</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="logo-box">BT</div>
            <h1>Панель управления</h1>
            <p>Войдите, чтобы управлять блогом Bilimtrack</p>
          </div>

          {error && (
            <div className="error-banner">
              <span>⚠️</span> {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="login-form">
            <div className="form-group">
              <label htmlFor="cms-email">Email или Логин</label>
              <input
                id="cms-email"
                type="text"
                required
                placeholder="admin@bilimtrack.com"
                value={email}
                autoComplete="username"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cms-password">Пароль</label>
              <input
                id="cms-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                autoComplete="current-password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button type="submit" disabled={isLoading} className="login-btn">
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>

        {/* eslint-disable-next-line react/no-unknown-property */}
        <style jsx global>{`
          .login-container {
            display: flex;
            min-height: 100vh;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background-color: var(--surface-app, #f8f8f8);
            font-family: var(--font-ui, sans-serif);
          }

          .login-card {
            width: 100%;
            max-width: 420px;
            background-color: var(--surface-lowest, #ffffff);
            border: 1px solid var(--stroke-primary, #e5e5e5);
            border-radius: var(--radius-2xl, 24px);
            padding: 40px;
            box-shadow: 0 8px 24px -6px rgba(0, 0, 0, 0.08);
            transition: box-shadow 0.2s ease;
          }

          .login-card:hover {
            box-shadow: 0 12px 32px -4px rgba(0, 0, 0, 0.12);
          }

          .login-header {
            display: flex;
            flex-direction: column;
            align-items: center;
            margin-bottom: 32px;
            text-align: center;
          }

          .logo-box {
            width: 48px;
            height: 48px;
            border-radius: var(--radius-lg, 12px);
            background-color: var(--blue-600, #155dfc);
            color: #ffffff;
            font-weight: 700;
            font-size: 20px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            letter-spacing: -0.02em;
          }

          .login-header h1 {
            font-size: 24px;
            font-weight: 700;
            margin: 0 0 6px;
            color: var(--text-primary, #0a0a0a);
            letter-spacing: -0.02em;
          }

          .login-header p {
            font-size: 14px;
            margin: 0;
            color: var(--text-muted, #737373);
          }

          .error-banner {
            background-color: rgba(251, 44, 54, 0.06);
            color: var(--text-error, #fb2c36);
            border: 1px solid rgba(251, 44, 54, 0.15);
            border-radius: var(--radius-md, 8px);
            padding: 12px 16px;
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 24px;
            display: flex;
            align-items: center;
            gap: 8px;
          }

          .login-form {
            display: flex;
            flex-direction: column;
            gap: 20px;
          }

          .form-group {
            display: flex;
            flex-direction: column;
            gap: 6px;
          }

          .form-group label {
            font-size: 12px;
            font-weight: 600;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            color: var(--text-muted, #737373);
          }

          .form-group input {
            width: 100%;
            height: 44px;
            border-radius: var(--radius-full, 9999px);
            border: 1px solid var(--stroke-primary, #e5e5e5);
            background-color: var(--surface-middle, #f5f5f5);
            padding: 0 18px;
            font-size: 14px;
            color: var(--text-primary, #0a0a0a);
            outline: none;
            transition: border-color 0.15s ease, background-color 0.15s ease;
            box-sizing: border-box;
          }

          .form-group input::placeholder {
            color: var(--text-placeholder, #a1a1a1);
          }

          .form-group input:focus {
            border-color: var(--stroke-brand, #155dfc);
            background-color: var(--surface-lowest, #ffffff);
          }

          .login-btn {
            height: 44px;
            border-radius: var(--radius-full, 9999px);
            border: none;
            background-color: var(--btn-primary-default, #155dfc);
            color: var(--text-on-solid, #ffffff);
            font-size: 14px;
            font-weight: 600;
            cursor: pointer;
            transition: background-color 0.15s ease, transform 0.05s ease;
            margin-top: 8px;
          }

          .login-btn:hover:not(:disabled) {
            background-color: var(--btn-primary-hover, #2b7fff);
          }

          .login-btn:active:not(:disabled) {
            transform: translateY(1px);
          }

          .login-btn:disabled {
            opacity: 0.6;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </>
  );
}
