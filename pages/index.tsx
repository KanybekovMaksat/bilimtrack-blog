import { useEffect } from "react";
import { useRouter } from "next/router";

/** The site front door: redirects to login if not authenticated, otherwise to /blog. */
export default function HomeRedirect() {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    if (token) {
      router.replace("/blog");
    } else {
      router.replace("/writer/login");
    }
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
