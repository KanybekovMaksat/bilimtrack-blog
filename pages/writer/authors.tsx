import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { EditorNav } from "@/widgets/editor-nav";

const MOCK_AUTHORS = [
  { id: "1", name: "Айгуль Нурманова", role: "Главный редактор", articles: 12, avatar: "АН", joined: "Янв 2025" },
  { id: "2", name: "Данияр Сейткали", role: "Автор", articles: 7, avatar: "ДС", joined: "Мар 2025" },
  { id: "3", name: "Камила Оразова", role: "Автор", articles: 5, avatar: "КО", joined: "Апр 2025" },
  { id: "4", name: "Арман Бекова", role: "Редактор", articles: 3, avatar: "АБ", joined: "Май 2025" },
];

const AVATAR_COLORS = ["#155dfc", "#00a63e", "#ad46ff", "#ea580c"];

export default function WriterAuthorsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem("cms_token")) router.replace("/writer/login");
    else setIsAuth(true);
  }, [router]);

  if (!isAuth) return null;

  return (
    <>
      <Head>
        <title>Авторы — Bilimtrack CMS</title>
        <meta name="robots" content="noindex" />
      </Head>

      <div className="admin-body admin-body--full">
        <EditorNav />

        <main className="articles-page">
          <div className="articles-topbar">
            <div>
              <h1 className="articles-title">Авторы</h1>
              <p className="articles-sub">Команда редакции блога</p>
            </div>
            <button className="btn btn--primary">+ Пригласить автора</button>
          </div>

          <div className="authors-grid">
            {MOCK_AUTHORS.map((author, i) => (
              <div key={author.id} className="author-card">
                <div
                  className="author-card__avatar"
                  style={{ background: AVATAR_COLORS[i % AVATAR_COLORS.length] }}
                >
                  {author.avatar}
                </div>
                <div className="author-card__info">
                  <div className="author-card__name">{author.name}</div>
                  <div className="author-card__role">{author.role}</div>
                </div>
                <div className="author-card__stats">
                  <div className="author-stat">
                    <span className="author-stat__num">{author.articles}</span>
                    <span className="author-stat__label">статей</span>
                  </div>
                  <div className="author-stat">
                    <span className="author-stat__num">{author.joined}</span>
                    <span className="author-stat__label">с нами</span>
                  </div>
                </div>
                <div className="author-card__actions">
                  <button className="cat-action-btn">Профиль</button>
                  <button className="cat-action-btn">Статьи</button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </>
  );
}
