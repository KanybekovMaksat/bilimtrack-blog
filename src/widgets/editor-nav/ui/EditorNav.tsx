import NextLink from "next/link";
import { Avatar } from "@heroui/react";

import { ARTICLES } from "@/entities/article";
import { CATEGORIES } from "@/entities/category";
import { Icon } from "@/shared/ui";
import { siteConfig } from "@/shared/config";

const realCategories = CATEGORIES.filter((c) => c.key !== "all").length;

/** Left navigation rail of the blog admin, modelled on the Mentor console. */
export function EditorNav() {
  return (
    <nav className="admin-nav">
      <NextLink className="brand" href="/blog">
        <img alt="" src="/logo-mark.png" />
        <span>
          <span
            className="brand__name"
            style={{ display: "block", lineHeight: 1.1 }}
          >
            Bilimtrack
          </span>
          <span className="brand__sub">Редакция блога</span>
        </span>
      </NextLink>

      <div className="nav-section">Контент</div>
      <div className="nav-item">
        <Icon name="file-text" />
        Статьи<span className="badge">{ARTICLES.length}</span>
      </div>
      <div className="nav-item is-active">
        <Icon name="pencil" />
        Новая статья
      </div>
      <div className="nav-item">
        <Icon name="tag" />
        Категории<span className="badge">{realCategories}</span>
      </div>
      <div className="nav-item">
        <Icon name="photo" />
        Медиа
      </div>

      <div className="nav-section">Аналитика</div>
      <div className="nav-item">
        <Icon name="chart-bar" />
        Статистика
      </div>
      <div className="nav-item">
        <Icon name="users" />
        Авторы
      </div>

      <div className="admin-nav__spacer" />

      <div className="nav-item">
        <Icon name="settings" />
        Настройки
      </div>
      <div className="admin-nav__user">
        <Avatar className="admin-nav__avatar">
          <Avatar.Image alt="" src="/avatar-default.png" />
          <Avatar.Fallback>АУ</Avatar.Fallback>
        </Avatar>
        <span>
          <b>А. Усенова</b>
          <span>Главный редактор</span>
        </span>
      </div>
      <div className="admin-nav__legal">{siteConfig.legal}</div>
    </nav>
  );
}
