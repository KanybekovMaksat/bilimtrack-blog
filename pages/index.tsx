import { useEffect } from "react";
import { useRouter } from "next/router";
import { cmsApi } from "@/shared/api/blog-api";

/**
 * The site front door.
 *
 * On load:
 *  1. If refresh token exists → try POST /auth/refresh/
 *     - Success  → save new access token, redirect to /blog
 *     - Failure  → clear tokens, redirect to /writer/login
 *  2. No tokens at all → redirect to /writer/login
 */
export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const refresh = localStorage.getItem("cms_refresh_token");

    if (!refresh) {
      // No session at all → go to login
      router.replace("/writer/login");
      return;
    }

    // Try to exchange refresh token for a new access token
    cmsApi
      .refreshToken(refresh)
      .then((data) => {
        const newAccess = data?.data?.access ?? data?.access ?? null;
        if (newAccess) {
          localStorage.setItem("cms_token", newAccess);
          router.replace("/blog");
        } else {
          // Refresh token is expired / invalid
          localStorage.removeItem("cms_token");
          localStorage.removeItem("cms_refresh_token");
          router.replace("/writer/login");
        }
      })
      .catch(() => {
        localStorage.removeItem("cms_token");
        localStorage.removeItem("cms_refresh_token");
        router.replace("/writer/login");
      });
  }, [router]);

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
      </div>
    </div>
  );
}
