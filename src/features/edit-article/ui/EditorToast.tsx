import { Icon } from "@/shared/ui";
import { cn } from "@/shared/lib";

import type { ArticleEditorApi } from "../model/useArticleEditor";

/** Floating confirmation toast for save / publish / delete. */
export function EditorToast({ toast }: { toast: ArticleEditorApi["toast"] }) {
  return (
    <div className={cn("toast", toast.show && "show")}>
      <Icon name={toast.icon} />
      <span>{toast.text}</span>
    </div>
  );
}
