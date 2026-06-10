import { type RefObject, useEffect, useState } from "react";

interface ReadingProgressProps {
  targetRef: RefObject<HTMLElement | null>;
}

/** Thin top progress bar tracking scroll through the article. */
export function ReadingProgress({ targetRef }: ReadingProgressProps) {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = targetRef.current;

      if (!el) return;
      const top = el.offsetTop;
      const h = el.offsetHeight - window.innerHeight;
      const p = Math.min(1, Math.max(0, (window.scrollY - top + 120) / h));

      setWidth(p * 100);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => window.removeEventListener("scroll", onScroll);
  }, [targetRef]);

  return <div className="read-progress" style={{ width: `${width}%` }} />;
}
