import type { ReactNode } from "react";

import NextLink from "next/link";
import { Button as HeroButton } from "@heroui/react";

import { cn } from "@/shared/lib";

export type ButtonVariant = "primary" | "secondary" | "outline";
export type ButtonSize = "md" | "sm";

interface BaseProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Full-width pill. */
  block?: boolean;
  className?: string;
  children?: ReactNode;
}

interface LinkProps extends BaseProps {
  href: string;
  target?: string;
  rel?: string;
  onPress?: never;
  type?: never;
}

interface ActionProps extends BaseProps {
  href?: undefined;
  onPress?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
}

export type ButtonProps = LinkProps | ActionProps;

function btnClass(
  variant: ButtonVariant,
  size: ButtonSize,
  block: boolean | undefined,
  className: string | undefined,
) {
  return cn(
    "btn",
    `btn--${variant}`,
    size === "sm" && "btn--sm",
    block && "btn--block",
    className,
  );
}

/**
 * Brand button. Renders a real HeroUI `<Button>` for actions (focus ring,
 * press behaviour, a11y) and a Next `<Link>` for navigation — both styled
 * with the design system's `.btn` classes so they stay pixel-faithful.
 */
export function Button(props: ButtonProps) {
  const { variant = "primary", size = "md", block, className, children } = props;
  const cls = btnClass(variant, size, block, className);

  if (props.href !== undefined) {
    const { href, target, rel } = props;

    return (
      <NextLink className={cls} href={href} rel={rel} target={target}>
        {children}
      </NextLink>
    );
  }

  return (
    <HeroButton
      className={cls}
      type={props.type ?? "button"}
      variant={variant}
      onPress={props.onPress}
      isDisabled={props.disabled}
    >
      {children}
    </HeroButton>
  );
}
