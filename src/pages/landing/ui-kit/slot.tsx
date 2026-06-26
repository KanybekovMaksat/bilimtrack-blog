import * as React from "react";

import { cn } from "./cn";

/**
 * Minimal `asChild` Slot — merges the parent's className/handlers onto a single
 * child element. Covers the landing's usage (`<Button asChild><a/></Button>`)
 * without pulling in @radix-ui/react-slot.
 */
export function Slot({
  children,
  className,
  ...slotProps
}: React.HTMLAttributes<HTMLElement> & { children?: React.ReactNode }) {
  if (!React.isValidElement(children)) return null;

  const child = children as React.ReactElement<any>;
  const childProps = child.props ?? {};

  return React.cloneElement(child, {
    ...slotProps,
    ...childProps,
    className: cn(className, childProps.className),
  });
}
