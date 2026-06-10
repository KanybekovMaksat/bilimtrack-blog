import { useCallback, useRef, useState } from "react";

/** Share handlers for the current page (Telegram / WhatsApp / copy link). */
export function useShareArticle() {
  const [copied, setCopied] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const getContext = () => ({
    url: typeof window !== "undefined" ? window.location.href : "",
    title: typeof document !== "undefined" ? document.title : "",
  });

  const shareTelegram = useCallback(() => {
    const { url, title } = getContext();

    window.open(
      `https://t.me/share/url?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      "_blank",
    );
  }, []);

  const shareWhatsApp = useCallback(() => {
    const { url, title } = getContext();

    window.open(
      `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
      "_blank",
    );
  }, []);

  const copyLink = useCallback(() => {
    const { url } = getContext();

    navigator.clipboard?.writeText(url);
    setCopied(true);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => setCopied(false), 1600);
  }, []);

  return { copied, shareTelegram, shareWhatsApp, copyLink };
}
