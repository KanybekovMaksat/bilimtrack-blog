import { Icon } from "@/shared/ui";

import { useShareArticle } from "../model/useShareArticle";

/** Labelled share row shown under the article header. */
export function ShareRow() {
  const { copied, shareTelegram, shareWhatsApp, copyLink } = useShareArticle();

  return (
    <div className="share-row">
      <span className="label">Поделиться:</span>
      <button
        className="share-btn share-btn--tg"
        type="button"
        onClick={shareTelegram}
      >
        <Icon name="telegram" />
        Telegram
      </button>
      <button
        className="share-btn share-btn--wa"
        type="button"
        onClick={shareWhatsApp}
      >
        <Icon name="whatsapp" />
        WhatsApp
      </button>
      <button className="share-btn" type="button" onClick={copyLink}>
        <Icon name="link" />
        <span>{copied ? "Ссылка скопирована" : "Скопировать ссылку"}</span>
      </button>
    </div>
  );
}
