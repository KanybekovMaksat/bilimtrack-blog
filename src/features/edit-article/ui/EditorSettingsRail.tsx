import { useRef } from "react";
import type { ArticleCategory } from "@/entities/category";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/lib";

import type { ArticleEditorApi } from "../model/useArticleEditor";

interface Props {
  editor: ArticleEditorApi;
}

/** Fallback category list used when the API hasn't responded yet. */
const FALLBACK_CATS: { value: ArticleCategory; label: string }[] = [
  { value: "cases",  label: "Кейсы" },
  { value: "manage", label: "Управление школой" },
  { value: "advice", label: "Советы директору" },
  { value: "news",   label: "Новости" },
];

/** Right settings rail: status, category, reading time, slug, cover, SEO. */
export function EditorSettingsRail({ editor }: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Build category options: prefer API data, fall back to static list
  const catOptions =
    editor.categoriesList.length > 0
      ? editor.categoriesList.map((c) => ({ value: c.slug as ArticleCategory, label: c.name }))
      : FALLBACK_CATS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) editor.uploadCover(file);
    // Reset input so the same file can be re-uploaded if needed
    e.target.value = "";
  };

  return (
    <aside className="settings-rail">
      <div className="rail-actions">
        <Button size="sm" variant="secondary" onPress={editor.saveDraft}>
          <Icon name="device-floppy" />
          Сохранить
        </Button>
        <Button size="sm" onPress={editor.publish}>
          Опубликовать
        </Button>
      </div>

      {/* ── Status ─────────────────────────────────────────────────────────── */}
      <div className="rail-block">
        <p className="rail-label">Статус</p>
        <div className="segment">
          <button
            className={cn(editor.status === "draft" && "is-active")}
            data-v="draft"
            type="button"
            onClick={() => editor.setStatus("draft")}
          >
            <span className="dot" />
            Черновик
          </button>
          <button
            className={cn(editor.status === "published" && "is-active")}
            data-v="published"
            type="button"
            onClick={() => editor.setStatus("published")}
          >
            <span className="dot" />
            Опубликовано
          </button>
        </div>
      </div>

      {/* ── Category ───────────────────────────────────────────────────────── */}
      <div className="rail-block">
        <p className="rail-label">
          <Icon name="tag" />
          Категория
        </p>
        <select
          className="field-select"
          style={{
            borderColor: editor.errors.category ? "red" : undefined,
            boxShadow: editor.errors.category ? "0 0 0 1.5px red" : undefined
          }}
          value={editor.cat}
          onChange={(e) => {
            editor.setCat(e.target.value as ArticleCategory);
            editor.clearError("category");
          }}
        >
          <option value="">— выбрать категорию —</option>
          {catOptions.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
        {editor.errors.category && (
          <p style={{ color: "red", fontSize: "12px", marginTop: "4px", fontWeight: 500 }}>
            {editor.errors.category}
          </p>
        )}
      </div>

      {/* ── Author ─────────────────────────────────────────────────────────── */}
      {editor.authorsList.length > 0 && (
        <div className="rail-block">
          <p className="rail-label">
            <Icon name="user" />
            Автор
          </p>
          <select
            className="field-select"
            style={{
              borderColor: editor.errors.author ? "red" : undefined,
              boxShadow: editor.errors.author ? "0 0 0 1.5px red" : undefined
            }}
            value={editor.selectedAuthorId ?? ""}
            onChange={(e) => {
              editor.setSelectedAuthorId(e.target.value || null);
              editor.clearError("author");
            }}
          >
            <option value="">— выбрать автора —</option>
            {editor.authorsList.map((a) => (
              <option key={a.id} value={a.id}>
                {a.name}
              </option>
            ))}
          </select>
          {editor.errors.author && (
            <p style={{ color: "red", fontSize: "12px", marginTop: "4px", fontWeight: 500 }}>
              {editor.errors.author}
            </p>
          )}
        </div>
      )}

      {/* ── Reading time ────────────────────────────────────────────────────── */}
      <div className="rail-block">
        <p className="rail-label">
          <Icon name="clock" />
          Время чтения
        </p>
        <div className="readtime">
          <span className="readtime__num">{editor.readMinutes}</span>
          <span className="readtime__lbl">
            <b>{editor.wordLabel}</b>
            считается автоматически
            <br />
            (~200 слов / мин)
          </span>
        </div>
      </div>

      {/* ── Publication date & slug ─────────────────────────────────────────── */}
      <div className="rail-block">
        <p className="rail-label">
          <Icon name="calendar" />
          Публикация
        </p>
        <div className="field">
          <input
            className="field-input"
            type="date"
            value={editor.pubDate}
            onChange={(e) => editor.setPubDate(e.target.value)}
          />
        </div>
        <div className="field">
          <div className="field-slug">
            <span className="pfx">/blog/</span>
            <input
              placeholder="url-statyi"
              value={editor.slug}
              onChange={(e) => editor.editSlug(e.target.value)}
            />
          </div>
          <div className="field-hint">
            <span>Канонический URL</span>
            <span className={editor.slugAuto ? "ok" : ""}>
              {editor.slugAuto ? "авто" : "вручную"}
            </span>
          </div>
        </div>
      </div>

      {/* ── Cover ───────────────────────────────────────────────────────────── */}
      <div className="rail-block">
        <p className="rail-label">
          <Icon name="photo" />
          Обложка
        </p>

        {/* Cover Aspect Ratio Selection */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ display: "block", fontSize: "12px", color: "var(--text-subtle)", fontWeight: 600, marginBottom: "6px" }}>
            Пропорции обложки
          </label>
          <select
            className="field-select"
            value={editor.coverAspect}
            onChange={(e) => editor.setCoverAspect(e.target.value)}
          >
            <option value="16-9">16:9 (Стандарт)</option>
            <option value="21-9">21:9 (Широкий)</option>
            <option value="3-2">3:2 (Фото)</option>
            <option value="1-1">1:1 (Квадрат)</option>
          </select>
        </div>

        {/* Uploaded real image preview */}
        {editor.coverImageUrl && (
          <div className="cover-upload-preview" style={{ aspectRatio: editor.coverAspect.replace("-", "/") }}>
            <img
              src={editor.coverImageUrl}
              alt="Обложка статьи"
              className="cover-upload-preview__img"
            />
            <button
              className="cover-upload-preview__remove"
              type="button"
              title="Удалить изображение"
              onClick={() => {
                editor.removeCover();
              }}
            >
              <Icon name="x" />
            </button>
          </div>
        )}

        {/* Upload own image */}
        <div className="cover-upload-row">
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            style={{ display: "none" }}
            onChange={handleFileChange}
          />
          <button
            className={cn("cover-upload-btn", editor.isUploadingCover && "is-loading")}
            type="button"
            disabled={editor.isUploadingCover}
            onClick={() => fileInputRef.current?.click()}
          >
            {editor.isUploadingCover ? (
              <>
                <span className="spinner" />
                Загрузка...
              </>
            ) : (
              <>
                <Icon name="upload" />
                {editor.coverImageUrl ? "Заменить изображение" : "Загрузить своё"}
              </>
            )}
          </button>
          {editor.coverImageUrl && (
            <span className="cover-upload-hint">Загружено ✓</span>
          )}
        </div>
      </div>

      {/* ── SEO & OG ────────────────────────────────────────────────────────── */}
      <div className="rail-block">
        <p className="rail-label">SEO и превью</p>
        <div className="field">
          <input
            className="field-input"
            placeholder="Title для поиска"
            value={editor.seoTitle}
            onChange={(e) => editor.setSeoTitle(e.target.value)}
          />
          <div className="field-hint">
            <span>Заголовок в Google</span>
            <span className={editor.seoTitleLen > 60 ? "over" : ""}>
              {editor.seoTitleLen} / 60
            </span>
          </div>
        </div>
        <div className="field">
          <textarea
            className="field-textarea"
            placeholder="Описание для Telegram и WhatsApp"
            value={editor.seoDesc}
            onChange={(e) => editor.setSeoDesc(e.target.value)}
          />
          <div className="field-hint">
            <span>OG-описание</span>
            <span className={editor.seoDescLen > 160 ? "over" : ""}>
              {editor.seoDescLen} / 160
            </span>
          </div>
        </div>
      </div>

      {/* ── Danger zone ─────────────────────────────────────────────────────── */}
      <div className="rail-block">
        <button className="rail-danger" type="button" onClick={editor.deleteDraft}>
          <Icon name="trash" />
          Удалить черновик
        </button>
      </div>
    </aside>
  );
}
