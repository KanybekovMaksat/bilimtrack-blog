import { useEffect, useState } from "react";
import { useRouter } from "next/router";

interface RequireAuthProps {
  children: React.ReactNode;
}

/**
 * Centered auth guard for /writer/* pages.
 * Checks for cms_token on mount (client-side only).
 * If absent, redirects to /writer/login.
 */
export function RequireAuth({ children }: RequireAuthProps) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    if (!token) {
      router.replace("/writer/login");
    } else {
      setIsAuthorized(true);
    }
  }, [router]);

  if (!isAuthorized) {
    return (
      <div
        style={{
          display: "flex",
          minHeight: "100vh",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "var(--surface-app, #ffffff)",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              borderRadius: "50%",
              border: "3px solid var(--stroke-primary, #e5e5e5)",
              borderTopColor: "var(--btn-primary-default, #155dfc)",
              animation: "spin 0.7s linear infinite",
            }}
          />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p
            style={{
              fontSize: "14px",
              color: "var(--text-muted, #737373)",
              margin: 0,
              fontFamily: "var(--font-ui, sans-serif)",
            }}
          >
            Проверка авторизации...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
