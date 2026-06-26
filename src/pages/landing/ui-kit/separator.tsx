import * as React from "react";

import { cn } from "./cn";

/** Thin divider (no @radix-ui). */
function Separator({
  className,
  orientation = "horizontal",
  ...props
}: React.ComponentProps<"div"> & {
  orientation?: "horizontal" | "vertical";
}) {
  return (
    <div
      data-slot="separator-root"
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "bg-black/10 shrink-0",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
      {...props}
    />
  );
}

export { Separator };
