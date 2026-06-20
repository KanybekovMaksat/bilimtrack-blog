import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";

const MOCK_MEDIA = [
  { id: "1", name: "schedule-screenshot.png", size: "142 KB", type: "image/png", date: "10 июн 2026", used: 3 },
  { id: "2", name: "journal-ui.jpg", size: "89 KB", type: "image/jpeg", date: "05 июн 2026", used: 1 },
  { id: "3", name: "analytics-dashboard.png", size: "215 KB", type: "image/png", date: "02 июн 2026", used: 2 },
  { id: "4", name: "mobile-app-screens.jpg", size: "178 KB", type: "image/jpeg", date: "28 май 2026", used: 0 },
  { id: "5", name: "school-photo.jpg", size: "340 KB", type: "image/jpeg", date: "20 май 2026", used: 5 },
  { id: "6", name: "bilimtrack-logo.svg", size: "12 KB", type: "image/svg+xml", date: "01 янв 2026", used: 12 },
];

const BG_COLORS = [
  "linear-gradient(135deg, #eafaf0, #d3f3df)",
  "linear-gradient(135deg, #eef4ff, #dbe9ff)",
  "linear-gradient(135deg, #f6effe, #ecdcfb)",
  "linear-gradient(135deg, #fff4ea, #ffe6cf)",
  "linear-gradient(135deg, #eef4ff, #dbe9ff)",
  "linear-gradient(135deg, #1b2a4a, #0d1730)",
];

export default function WriterMediaPage() {
  const router = useRouter();
  const [view, setView] = useState<"grid" | "list">("grid");
  const [dragging, setDragging] = useState(false);

  return (
    <>
      <Head>
        <title>Медиа — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Медиа</h1>
              <p className="articles-sub">Изображения и файлы</p>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                className={`btn btn--outline${view === "grid" ? " is-active" : ""}`}
                onClick={() => setView("grid")}
                title="Сетка"
              >
                ⊞
              </button>
              <button
                className={`btn btn--outline${view === "list" ? " is-active" : ""}`}
                onClick={() => setView("list")}
                title="Список"
              >
                ☰
              </button>
            </div>
          </div>

          {/* Drop zone */}
          <div
            className={`media-dropzone${dragging ? " is-dragging" : ""}`}
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => { e.preventDefault(); setDragging(false); }}
          >
            <span className="media-dropzone__icon">📎</span>
            <span>Перетащите файлы или <label className="media-dropzone__link">выберите вручную<input type="file" hidden multiple /></label></span>
            <span className="media-dropzone__hint">PNG, JPG, SVG, GIF — до 5 МБ</span>
          </div>

          {view === "grid" ? (
            <div className="media-grid">
              {MOCK_MEDIA.map((file, i) => (
                <div key={file.id} className="media-card">
                  <div className="media-card__thumb" style={{ background: BG_COLORS[i % BG_COLORS.length] }}>
                    <span className="media-card__ext">{file.type.split("/")[1].toUpperCase()}</span>
                  </div>
                  <div className="media-card__name">{file.name}</div>
                  <div className="media-card__meta">{file.size} · {file.date}</div>
                  {file.used > 0 && (
                    <div className="media-card__used">Используется в {file.used} статьях</div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <table className="art-table">
              <thead>
                <tr>
                  <th>Файл</th>
                  <th>Тип</th>
                  <th>Размер</th>
                  <th>Дата</th>
                  <th>Используется</th>
                </tr>
              </thead>
              <tbody>
                {MOCK_MEDIA.map((file) => (
                  <tr key={file.id}>
                    <td className="art-table__title">{file.name}</td>
                    <td><span className="art-cat">{file.type}</span></td>
                    <td className="art-table__date">{file.size}</td>
                    <td className="art-table__date">{file.date}</td>
                    <td className="art-table__num">{file.used > 0 ? `${file.used} статей` : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </main>
      </div>
    </>
  );
}
