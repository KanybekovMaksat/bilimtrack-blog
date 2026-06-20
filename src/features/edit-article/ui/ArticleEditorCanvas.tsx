import { useState, useRef } from "react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import { BlockNoteView } from "@blocknote/mantine";
import { MantineProvider } from "@mantine/core";

import { ArticleCover } from "@/entities/article";
import { CategoryTag } from "@/entities/category";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/lib";

import type { ArticleEditorApi } from "../model/useArticleEditor";
import { ImageCropperModal } from "./ImageCropperModal";

interface Props {
  editor: ArticleEditorApi;
}

function EditorTopbar({ editor }: Props) {
  const isEditMode = Boolean(editor.articleId);
  return (
    <div className="editor-topbar">
      <a className="topbar-back" href="/writer/articles">
        <Icon name="arrow-left" />
        <span className="lbl">Статьи</span>
      </a>
      <span className="topbar-crumb">
        Статьи&nbsp; /&nbsp; <b>{isEditMode ? "Редактировать" : "Новая статья"}</b>
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

/** Center authoring column: cover, title/excerpt, formatting toolbar, body. */
export function ArticleEditorCanvas({ editor }: Props) {
  const { refs } = editor;
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [cropSrc, setCropSrc] = useState<string | null>(null);
  const [cropFileName, setCropFileName] = useState<string>("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCropSrc(reader.result as string);
        setCropFileName(file.name);
      };
      reader.readAsDataURL(file);
    }
    e.target.value = "";
  };

  const hasCover = Boolean(editor.coverImageUrl || editor.cover);
  const displayAspect = editor.coverAspect || "16-9";

  return (
    <div className="editor-col">
      <EditorTopbar editor={editor} />

      <div className="editor-scroll">
        <div className="editor-canvas">
          {/* Cover slot */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className={cn("cover-slot", hasCover && "has-cover")}
            style={{ width: "100%", aspectRatio: displayAspect.replace("-", "/") }}
            type="button"
            onClick={() => fileInputRef.current?.click()}
          >
            {hasCover && (
              <ArticleCover cat={editor.cat as any} cover={(editor.coverImageUrl || editor.cover) as any} />
            )}
            {!hasCover && (
              <span className="cover-slot__hint">
                <Icon name="photo" />
                Добавить обложку {displayAspect.replace("-", ":")}
              </span>
            )}
            <span className="cover-slot__edit">
              <Icon name="photo" />
              Изменить
            </span>
          </button>

          {cropSrc && (
            <ImageCropperModal
              imageSrc={cropSrc}
              aspect={editor.coverAspect}
              fileName={cropFileName}
              onChangeAspect={editor.setCoverAspect}
              onCancel={() => {
                setCropSrc(null);
                setCropFileName("");
              }}
              onCrop={(croppedFile) => {
                editor.uploadCover(croppedFile);
                setCropSrc(null);
                setCropFileName("");
              }}
            />
          )}

          <div className="editor-metarow">
            {editor.cat ? (
              <CategoryTag category={editor.cat} />
            ) : (
              <span
                className="tag"
                style={{
                  background: editor.errors.category ? "#fee2e2" : "#f5f5f5",
                  color: editor.errors.category ? "#ef4444" : "#737373",
                  borderColor: editor.errors.category ? "red" : "#d4d4d4",
                  borderWidth: "1px",
                  borderStyle: "solid",
                  fontWeight: 600,
                  padding: "4px 10px",
                  borderRadius: "9999px",
                  fontSize: "12px"
                }}
              >
                {editor.errors.category ? "Выберите категорию (обязательно!)" : "Категория не выбрана"}
              </span>
            )}
          </div>

          <textarea
            ref={refs.titleRef}
            className="title-input"
            style={{ borderBottom: editor.errors.title ? "2px solid red" : undefined }}
            placeholder="Заголовок статьи"
            rows={1}
            value={editor.title}
            onChange={(e) => {
              editor.setTitle(e.target.value);
              editor.clearError("title");
            }}
          />
          {editor.errors.title && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "-12px", marginBottom: "16px", fontWeight: 500 }}>
              {editor.errors.title}
            </p>
          )}

          <textarea
            ref={refs.excerptRef}
            className="excerpt-input"
            style={{ borderBottom: editor.errors.excerpt ? "2px solid red" : undefined }}
            placeholder="Краткое описание — 1–2 строки, появится в карточке и превью для Telegram"
            rows={2}
            value={editor.excerpt}
            onChange={(e) => {
              editor.setExcerpt(e.target.value);
              editor.clearError("excerpt");
            }}
          />
          {editor.errors.excerpt && (
            <p style={{ color: "red", fontSize: "13px", marginTop: "-12px", marginBottom: "16px", fontWeight: 500 }}>
              {editor.errors.excerpt}
            </p>
          )}

          {editor.errors.content && (
            <p style={{ color: "red", fontSize: "13px", marginBottom: "12px", fontWeight: 500 }}>
              {editor.errors.content}
            </p>
          )}

          {editor.editorInitialized ? (
            <div className="editor-body prose">
              <MantineProvider>
                <BlockNoteView
                  editor={editor.blockNote}
                  onChange={editor.onBodyChange}
                  theme="light"
                />
              </MantineProvider>
            </div>
          ) : (
            <div className="editor-body prose">Загрузка редактора...</div>
          )}
        </div>
      </div>
    </div>
  );
}
