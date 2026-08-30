import Link from "next/link";
import type { AnchorHTMLAttributes, ButtonHTMLAttributes, ReactNode } from "react";

type ButtonVariant = "primary" | "secondary" | "onair";
type ButtonTone = "light" | "dark";
type ButtonSize = "sm" | "md";

const baseFocus = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand";

const variantClasses: Record<ButtonVariant, Record<ButtonTone, string>> = {
  primary: {
    light: "btn-primary",
    dark: "btn-primary-dark",
  },
  secondary: {
    light: "btn-secondary",
    dark: "btn-secondary-dark",
  },
  onair: {
    light: "stream-cta",
    dark: "stream-cta-dark",
  },
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "!px-4 !py-2 text-xs",
  md: "",
};

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export function buttonClassName({
  variant = "primary",
  tone = "light",
  size = "md",
  className,
}: {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
}) {
  return cx(variantClasses[variant][tone], sizeClasses[size], baseFocus, className);
}

export function Button({
  variant = "primary",
  tone = "light",
  size = "md",
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
}) {
  return <button className={buttonClassName({ variant, tone, size, className })} {...props} />;
}

export function ButtonLink({
  href,
  children,
  variant = "primary",
  tone = "light",
  size = "md",
  className,
  ...props
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <Link href={href} className={buttonClassName({ variant, tone, size, className })} {...props}>
      {children}
    </Link>
  );
}

export function ExternalButtonLink({
  href,
  children,
  variant = "primary",
  tone = "light",
  size = "md",
  className,
  ...props
}: {
  href: string;
  children: ReactNode;
  variant?: ButtonVariant;
  tone?: ButtonTone;
  size?: ButtonSize;
  className?: string;
} & Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href">) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={buttonClassName({ variant, tone, size, className })}
      {...props}
    >
      {children}
    </a>
  );
}
