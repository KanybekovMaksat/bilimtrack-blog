import { useEffect, useState } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { useCreateBlockNote } from "@blocknote/react";

import { ArticleCover } from "@/entities/article";
import { CategoryTag } from "@/entities/category";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/lib";

import type { ArticleEditorApi } from "../model/useArticleEditor";

interface Props {
  editor: ArticleEditorApi;
}

function EditorTopbar({ editor }: Props) {
  return (
    <div className="editor-topbar">
      <a className="topbar-back" href="/blog">
        <Icon name="arrow-left" />
        <span className="lbl">К блогу</span>
      </a>
      <span className="topbar-crumb">
        Статьи&nbsp; /&nbsp; <b>Новая статья</b>
      </span>
      <span className="topbar-spacer" />
      <span className={cn("save-status", editor.dirty && "is-dirty")}>
        <Icon name="device-floppy" />
        <span className="lbl">
          {editor.dirty ? "Несохранённые изменения" : "Черновик сохранён"}
        </span>
      </span>
      <Button size="sm" variant="outline" onPress={editor.preview}>
        <Icon name="external-link" />
        <span className="lbl">Предпросмотр</span>
      </Button>
      <Button size="sm" onPress={editor.publish}>
        Опубликовать
      </Button>
    </div>
  );
}

function BlockNoteBody({ editorApi }: { editorApi: ArticleEditorApi }) {
  const blockNote = useCreateBlockNote();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    async function init() {
      if (editorApi.initialHtml && !initialized) {
        const blocks = await blockNote.tryParseHTMLToBlocks(editorApi.initialHtml);
        blockNote.replaceBlocks(blockNote.document, blocks);
        setInitialized(true);
      } else if (!editorApi.initialHtml && !initialized) {
        setInitialized(true);
      }
    }
    init();
  }, [blockNote, editorApi.initialHtml, initialized]);

  useEffect(() => {
    editorApi.refs.getEditorHTMLRef.current = async () => {
      return blockNote.blocksToFullHTML(blockNote.document);
    };
  }, [blockNote, editorApi.refs]);

  if (!initialized) {
    return <div className="editor-body prose">Загрузка редактора...</div>;
  }

  return (
    <div className="editor-body prose">
      <BlockNoteView
        editor={blockNote}
        onChange={editorApi.onBodyChange}
        theme="light"
      />
    </div>
  );
}

/** Center authoring column: cover, title/excerpt, formatting toolbar, body. */
export function ArticleEditorCanvas({ editor }: Props) {
  const { refs } = editor;

  return (
    <div className="editor-col">
      <EditorTopbar editor={editor} />

      <div className="editor-scroll">
        <div className="editor-canvas">
          {/* Cover */}
          <button
            className={cn("cover-slot", editor.cover && "has-cover")}
            type="button"
            onClick={editor.ensureCover}
          >
            {editor.cover && (
              <ArticleCover cat={editor.cat} cover={editor.cover} />
            )}
            {!editor.cover && (
              <span className="cover-slot__hint">
                <Icon name="photo" />
                Добавить обложку 16:9
              </span>
            )}
            <span className="cover-slot__edit">
              <Icon name="photo" />
              Изменить
            </span>
          </button>

          <div className="editor-metarow">
            <CategoryTag category={editor.cat} />
          </div>

          <textarea
            ref={refs.titleRef}
            className="title-input"
            placeholder="Заголовок статьи"
            rows={1}
            value={editor.title}
            onChange={(e) => editor.setTitle(e.target.value)}
          />
          <textarea
            ref={refs.excerptRef}
            className="excerpt-input"
            placeholder="Краткое описание — 1–2 строки, появится в карточке и превью для Telegram"
            rows={2}
            value={editor.excerpt}
            onChange={(e) => editor.setExcerpt(e.target.value)}
          />

          {editor.isReady && <BlockNoteBody editorApi={editor} />}
        </div>
      </div>
    </div>
  );
}
