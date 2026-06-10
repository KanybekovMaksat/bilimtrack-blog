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
  const editor = useArticleEditor();

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
