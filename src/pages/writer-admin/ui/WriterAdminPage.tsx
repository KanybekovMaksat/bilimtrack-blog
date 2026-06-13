import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";

import {
  ArticleEditorCanvas,
  EditorSettingsRail,
  EditorToast,
  useArticleEditor,
} from "@/features/edit-article";
import { EditorNav } from "@/widgets/editor-nav";

/** /writer/admin — desktop CMS for authoring blog articles. */
export function WriterAdminPage() {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const editor = useArticleEditor();

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
            }}
          >
            Проверка авторизации...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Редактор статьи — Bilimtrack</title>
        <meta content="noindex" name="robots" />
      </Head>

      <div className="admin-body">
        <EditorNav />
        <ArticleEditorCanvas editor={editor} />
        <EditorSettingsRail editor={editor} />
      </div>

      <EditorToast toast={editor.toast} />
    </>
  );
}
