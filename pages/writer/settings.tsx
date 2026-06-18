import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";
import { cmsApi } from "@/shared/api/blog-api";

interface UserMe {
  id?: string;
  username?: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  name?: string;
  role?: string;
  isStaff?: boolean;
}

function getFullName(u: UserMe | null): string {
  if (!u) return "—";
  if (u.name) return u.name;
  if (u.firstName || u.lastName) return `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim();
  return u.username ?? "—";
}

function getInitials(u: UserMe | null): string {
  const name = getFullName(u);
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("") || "АД";
}

export default function WriterSettingsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [user, setUser] = useState<UserMe | null>(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("cms_token");
    if (!token) {
      router.replace("/writer/login");
    } else {
      setIsAuth(true);
      // Load current user data
      cmsApi.getUserMe(token)
        .then((res) => {
          const u: UserMe = res?.data ?? res;
          if (u?.id || u?.username || u?.email) {
            setUser(u);
          }
        })
        .catch((err) => console.error("Failed to load user:", err));
    }
  }, [router]);

  if (!isAuth) return null;

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    const refresh = localStorage.getItem("cms_refresh_token");
    if (refresh) {
      try {
        await cmsApi.logout(refresh);
      } catch {
        // ignore logout error
      }
    }
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
                    defaultValue="Bilimtrack Blog"
                  />
                </div>
                <div className="field">
                  <label className="rail-label">Описание</label>
                  <textarea
                    className="field-textarea"
                    defaultValue="Практические материалы для руководителей учебных организаций."
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
                  <div className="settings-avatar">{getInitials(user)}</div>
                  <div>
                    <div className="settings-account__name">{getFullName(user)}</div>
                    <div className="settings-account__role">
                      {user?.role ?? (user?.isStaff ? "Администратор" : "Редактор")}
                    </div>
                  </div>
                </div>
                <div className="field">
                  <label className="rail-label">Email</label>
                  <input
                    className="field-input"
                    value={user?.email ?? ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="field">
                  <label className="rail-label">Имя пользователя</label>
                  <input
                    className="field-input"
                    value={user?.username ?? ""}
                    readOnly
                    disabled
                  />
                </div>
                <div className="field">
                  <label className="rail-label">Новый пароль</label>
                  <input
                    className="field-input"
                    type="password"
                    placeholder="Оставьте пустым, чтобы не менять"
                  />
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
