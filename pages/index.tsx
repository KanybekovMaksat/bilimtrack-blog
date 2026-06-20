import { useEffect } from "react";
import { useRouter } from "next/router";

/**
 * Client-side redirect from / to /blog.
 * Prevents Next.js prerendering redirect errors with multi-locale routing.
 */
export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/blog");
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
  );
}
