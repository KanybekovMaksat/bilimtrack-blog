import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";
import { cmsApi } from "@/shared/api/blog-api";

interface Category {
  id: string;
  nameRu?: string;
  name?: string;
  slug?: string;
  articlesCount?: number;
  articles?: number;
}

const CAT_COLORS = [
  { color: "#dcfce7", textColor: "#008236" },
  { color: "#faf5ff", textColor: "#9333ea" },
  { color: "#eff6ff", textColor: "#155dfc" },
  { color: "#fff7ed", textColor: "#ea580c" },
  { color: "#fef9c3", textColor: "#a16207" },
  { color: "#fce7f3", textColor: "#be185d" },
];

function getCatName(c: Category): string {
  return c.nameRu ?? c.name ?? c.slug ?? "—";
}

function getCatCount(c: Category): number {
  return c.articlesCount ?? c.articles ?? 0;
}

export default function WriterCategoriesPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newName, setNewName] = useState("");
  const [newSlug, setNewSlug] = useState("");
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editName, setEditName] = useState("");

  useEffect(() => {
    loadCategories();
  }, []);

  function loadCategories() {
    setLoading(true);
    setError(null);
    cmsApi.getCategories()
      .then((res) => {
        const list: Category[] = res?.data ?? res ?? [];
        setCategories(Array.isArray(list) ? list : []);
      })
      .catch(() => setError("Не удалось загрузить категории"))
      .finally(() => setLoading(false));
  }

  const handleCreate = async () => {
    if (!newName.trim()) return;
    setSaving(true);
    const token = localStorage.getItem("cms_token") ?? "";
    try {
      const slug = newSlug.trim() || newName.trim().toLowerCase().replace(/\s+/g, "-");
      const res = await cmsApi.createCategory(token, { nameRu: newName.trim(), slug });
      const created: Category = res?.data ?? res;
      if (created?.id) {
        setCategories((prev) => [...prev, created]);
        setShowForm(false);
        setNewName("");
        setNewSlug("");
      } else {
        alert("Ошибка при создании категории");
      }
    } catch {
      alert("Ошибка при создании категории");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Удалить категорию?")) return;
    setDeletingId(id);
    const token = localStorage.getItem("cms_token") ?? "";
    try {
      await cmsApi.deleteCategory(token, id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Ошибка при удалении");
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (cat: Category) => {
    setEditingId(cat.id);
    setEditName(getCatName(cat));
  };

  const handleUpdate = async (id: string) => {
    if (!editName.trim()) return;
    const token = localStorage.getItem("cms_token") ?? "";
    try {
      const res = await cmsApi.updateCategory(token, id, { nameRu: editName.trim() });
      const updated: Category = res?.data ?? res;
      if (updated?.id) {
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, ...updated } : c)));
      } else {
        // Optionally just update name locally if API returns nothing meaningful
        setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, nameRu: editName.trim() } : c)));
      }
    } catch {
      alert("Ошибка при обновлении");
    } finally {
      setEditingId(null);
      setEditName("");
    }
  };


  return (
    <>
      <Head>
        <title>Категории — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Категории</h1>
              <p className="articles-sub">Структурируйте контент блога</p>
            </div>
            <button className="btn btn--primary" onClick={() => setShowForm(true)}>
              + Новая категория
            </button>
          </div>

          {showForm && (
            <div className="cat-form-card">
              <h3>Новая категория</h3>
              <div className="cat-form-row">
                <input
                  className="field-input"
                  placeholder="Название категории..."
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  autoFocus
                />
                <input
                  className="field-input"
                  placeholder="slug (необязательно)"
                  value={newSlug}
                  onChange={(e) => setNewSlug(e.target.value)}
                  style={{ maxWidth: 180 }}
                />
                <button
                  className="btn btn--primary"
                  onClick={handleCreate}
                  disabled={saving || !newName.trim()}
                >
                  {saving ? "Сохраняем..." : "Сохранить"}
                </button>
                <button
                  className="btn btn--outline"
                  onClick={() => { setShowForm(false); setNewName(""); setNewSlug(""); }}
                >
                  Отмена
                </button>
              </div>
            </div>
          )}

          {loading && (
            <div className="art-empty" style={{ padding: "48px 0" }}>
              <span style={{ opacity: 0.5 }}>Загрузка категорий...</span>
            </div>
          )}
          {error && (
            <div className="art-empty" style={{ color: "var(--danger, #dc2626)", padding: "48px 0" }}>
              {error}
            </div>
          )}

          {!loading && !error && (
            <div className="cat-grid">
              {categories.length === 0 && (
                <div className="art-empty">Категории не найдены</div>
              )}
              {categories.map((cat, i) => {
                const palette = CAT_COLORS[i % CAT_COLORS.length];
                return (
                  <div key={cat.id} className="cat-card">
                    <div className="cat-card__header" style={{ background: palette.color }}>
                      <span className="cat-card__tag" style={{ color: palette.textColor }}>
                        {getCatName(cat)}
                      </span>
                    </div>
                    <div className="cat-card__body">
                      {editingId === cat.id ? (
                        <div className="cat-form-row" style={{ marginBottom: 8 }}>
                          <input
                            className="field-input"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            autoFocus
                          />
                          <button className="btn btn--primary" onClick={() => handleUpdate(cat.id)}>
                            ✓
                          </button>
                          <button className="btn btn--outline" onClick={() => setEditingId(null)}>
                            ✕
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="cat-card__name">{getCatName(cat)}</div>
                          <div className="cat-card__slug">/{cat.slug ?? "—"}</div>
                          <div className="cat-card__count">{getCatCount(cat)} статей</div>
                        </>
                      )}
                    </div>
                    <div className="cat-card__actions">
                      <button
                        className="cat-action-btn"
                        onClick={() => startEdit(cat)}
                      >
                        Редактировать
                      </button>
                      <button
                        className="cat-action-btn cat-action-btn--danger"
                        onClick={() => handleDelete(cat.id)}
                        disabled={deletingId === cat.id}
                      >
                        {deletingId === cat.id ? "..." : "Удалить"}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
