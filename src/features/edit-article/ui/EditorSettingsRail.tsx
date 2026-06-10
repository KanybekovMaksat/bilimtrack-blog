import { ArticleCover } from "@/entities/article";
import type { ArticleCategory } from "@/entities/category";
import { Button, Icon } from "@/shared/ui";
import { cn } from "@/shared/lib";

import type { ArticleEditorApi } from "../model/useArticleEditor";

interface Props {
  editor: ArticleEditorApi;
}

const CAT_OPTIONS: { value: ArticleCategory; label: string }[] = [
  { value: "cases", label: "Кейсы" },
  { value: "manage", label: "Управление школой" },
  { value: "advice", label: "Советы директору" },
  { value: "news", label: "Новости" },
];

/** Right settings rail: status, category, reading time, slug, cover, SEO. */
export function EditorSettingsRail({ editor }: Props) {
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

      <div className="rail-block">
        <p className="rail-label">
          <Icon name="tag" />
          Категория
        </p>
        <select
          className="field-select"
          value={editor.cat}
          onChange={(e) => editor.setCat(e.target.value as ArticleCategory)}
        >
          {CAT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

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

      <div className="rail-block">
        <p className="rail-label">
          <Icon name="photo" />
          Обложка
        </p>
        <div className="cover-presets">
          {editor.scenes.map((scene) => (
            <button
              key={scene}
              className={editor.cover === scene ? "is-active" : ""}
              type="button"
              onClick={() => editor.pickCover(scene)}
            >
              <ArticleCover cat={editor.cat} cover={scene} />
            </button>
          ))}
        </div>
      </div>

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

      <div className="rail-block">
        <button className="rail-danger" type="button" onClick={editor.deleteDraft}>
          <Icon name="trash" />
          Удалить черновик
        </button>
      </div>
    </aside>
  );
}
