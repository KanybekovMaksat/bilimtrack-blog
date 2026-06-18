import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";

export default function WriterSettingsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [blogName, setBlogName] = useState("Bilimtrack Blog");
  const [blogDesc, setBlogDesc] = useState("Практические материалы для руководителей учебных организаций.");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cms_token")) router.replace("/writer/login");
    else setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = () => {
    localStorage.removeItem("cms_token");
    localStorage.removeItem("cms_refresh_token");
    router.replace("/writer/login");
  };

  return (
    <>
      <Head>
        <title>Настройки — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Настройки</h1>
              <p className="articles-sub">Параметры блога и аккаунта</p>
            </div>
          </div>

          <div className="settings-sections">
            {/* Blog settings */}
            <div className="settings-section">
              <h2 className="settings-section__title">Настройки блога</h2>
              <div className="settings-fields">
                <div className="field">
                  <label className="rail-label">Название блога</label>
                  <input
                    className="field-input"
                    value={blogName}
                    onChange={(e) => setBlogName(e.target.value)}
                  />
                </div>
                <div className="field">
                  <label className="rail-label">Описание</label>
                  <textarea
                    className="field-textarea"
                    value={blogDesc}
                    onChange={(e) => setBlogDesc(e.target.value)}
                    rows={3}
                  />
                </div>
                <div className="field">
                  <label className="rail-label">Статей на страницу</label>
                  <select className="field-select" defaultValue="12">
                    <option value="6">6</option>
                    <option value="9">9</option>
                    <option value="12">12</option>
                    <option value="18">18</option>
                  </select>
                </div>
                <button
                  className="btn btn--primary"
                  onClick={handleSave}
                  style={{ alignSelf: "flex-start" }}
                >
                  {saved ? "✓ Сохранено!" : "Сохранить изменения"}
                </button>
              </div>
            </div>

            {/* Account */}
            <div className="settings-section">
              <h2 className="settings-section__title">Аккаунт</h2>
              <div className="settings-fields">
                <div className="settings-account-card">
                  <div className="settings-avatar">АН</div>
                  <div>
                    <div className="settings-account__name">А. Усенова</div>
                    <div className="settings-account__role">Главный редактор</div>
                  </div>
                </div>
                <div className="field">
                  <label className="rail-label">Email</label>
                  <input className="field-input" defaultValue="a.usenova@bilimtrack.com" disabled />
                </div>
                <div className="field">
                  <label className="rail-label">Новый пароль</label>
                  <input className="field-input" type="password" placeholder="Оставьте пустым, чтобы не менять" />
                </div>
              </div>
            </div>

            {/* Danger zone */}
            <div className="settings-section settings-section--danger">
              <h2 className="settings-section__title">Выход из системы</h2>
              <p className="settings-danger-text">
                После выхода вам потребуется снова войти в аккаунт.
              </p>
              <button className="rail-danger" onClick={handleLogout}>
                Выйти из аккаунта
              </button>
            </div>
          </div>
        </main>
      </div>
    </>
  );
}
