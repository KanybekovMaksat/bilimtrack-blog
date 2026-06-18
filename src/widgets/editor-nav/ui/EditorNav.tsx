import NextLink from "next/link";
import { useRouter } from "next/router";
import { Avatar } from "@heroui/react";

import { ARTICLES } from "@/entities/article";
import { CATEGORIES } from "@/entities/category";
import { Icon } from "@/shared/ui";
import { siteConfig } from "@/shared/config";

const realCategories = CATEGORIES.filter((c) => c.key !== "all").length;

interface NavItemProps {
  href: string;
  icon: string;
  label: string;
  badge?: number;
  activeHref: string;
}

function NavItem({ href, icon, label, badge, activeHref }: NavItemProps) {
  const isActive = activeHref === href;
  return (
    <NextLink
      href={href}
      className={`nav-item${isActive ? " is-active" : ""}`}
    >
      <Icon name={icon} />
      {label}
      {badge !== undefined && (
        <span className="badge">{badge}</span>
      )}
    </NextLink>
  );
}

/** Left navigation rail of the blog admin, modelled on the Mentor console. */
export function EditorNav() {
  const router = useRouter();
  const activeHref = router.pathname;

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
      <NavItem href="/writer/articles" icon="file-text" label="Статьи" badge={ARTICLES.length} activeHref={activeHref} />
      <NavItem href="/writer/admin"    icon="pencil"    label="Новая статья" activeHref={activeHref} />
      <NavItem href="/writer/categories" icon="tag"    label="Категории" badge={realCategories} activeHref={activeHref} />
      <NavItem href="/writer/media"    icon="photo"     label="Медиа" activeHref={activeHref} />

      <div className="nav-section">Аналитика</div>
      <NavItem href="/writer/stats"   icon="chart-bar" label="Статистика" activeHref={activeHref} />
      <NavItem href="/writer/authors" icon="users"     label="Авторы" activeHref={activeHref} />

      <div className="admin-nav__spacer" />

      <NavItem href="/writer/settings" icon="settings" label="Настройки" activeHref={activeHref} />
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
