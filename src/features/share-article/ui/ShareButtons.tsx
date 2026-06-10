import { Icon } from "@/shared/ui";

import { useShareArticle } from "../model/useShareArticle";

/** Icon-only share buttons for the sticky aside. */
export function ShareButtons() {
  const { shareTelegram, shareWhatsApp, copyLink } = useShareArticle();

  return (
    <div className="aside-share">
      <button
        className="share-btn share-btn--tg"
        title="Telegram"
        type="button"
        onClick={shareTelegram}
      >
        <Icon name="telegram" />
      </button>
      <button
        className="share-btn share-btn--wa"
        title="WhatsApp"
        type="button"
        onClick={shareWhatsApp}
      >
        <Icon name="whatsapp" />
      </button>
      <button
        className="share-btn"
        title="Скопировать ссылку"
        type="button"
        onClick={copyLink}
      >
        <Icon name="link" />
      </button>
    </div>
  );
}
