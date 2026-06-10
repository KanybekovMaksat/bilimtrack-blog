import { ICONS } from "./icons";

export type IconName = keyof typeof ICONS;

export interface IconProps {
  name: IconName | string;
  /** Font-size driven size (icons are 1em). Accepts any CSS length. */
  size?: number | string;
  className?: string;
  style?: React.CSSProperties;
  "aria-hidden"?: boolean;
}

/**
 * Renders an inline SVG from the ported design icon set.
 * Icons inherit `color` (currentColor) and scale with `font-size`,
 * mirroring the `<i data-ic="…">` placeholders in the prototype.
 */
export function Icon({ name, size, className, style, ...rest }: IconProps) {
  const svg = ICONS[name as string];

  if (!svg) {
    if (process.env.NODE_ENV !== "production") {
      // eslint-disable-next-line no-console
      console.warn(`[Icon] unknown icon "${name}"`);
    }

    return null;
  }

  const sizeStyle =
    size != null
      ? { fontSize: typeof size === "number" ? `${size}px` : size }
      : undefined;

  return (
    <span
      aria-hidden={rest["aria-hidden"] ?? true}
      className={className}
      style={{ display: "inline-flex", ...sizeStyle, ...style }}
      // The SVG markup is a trusted, build-time constant from our own icon set.
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}
