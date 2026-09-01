import Link from "next/link";
import type { ReactNode } from "react";

type BadgeVariant = "neutral" | "onair" | "onair-dark" | "video";

function cx(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

const badgeClasses: Record<BadgeVariant, string> = {
  neutral: "inline-flex items-center gap-2 border border-ink/15 bg-ink/5 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-ink/60",
  onair: "stream-badge",
  "onair-dark": "inline-flex items-center gap-1.5 border border-onair bg-onair-dark px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-onair-light",
  video: "inline-flex items-center gap-1.5 border border-brand/25 bg-transparent px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-brand-dark transition hover:border-brand/55 hover:text-brand",
};

export function Badge({
  variant = "neutral",
  children,
  className,
}: {
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return <span className={cx(badgeClasses[variant], className)}>{children}</span>;
}

export function BadgeLink({
  href,
  variant = "neutral",
  children,
  className,
}: {
  href: string;
  variant?: BadgeVariant;
  children: ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cx(badgeClasses[variant], "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand", className)}>
      {children}
    </Link>
  );
}

export function BadgeDot({
  tone = "neutral",
  pulse = false,
}: {
  tone?: "neutral" | "onair" | "brand";
  pulse?: boolean;
}) {
  const color = tone === "onair" ? "bg-onair" : tone === "brand" ? "bg-brand" : "bg-ink/30";

  return (
    <span className="relative flex h-2 w-2">
      {pulse && <span className={`absolute inline-flex h-full w-full animate-ping rounded-full ${color} opacity-75`} />}
      <span className={`relative inline-flex h-2 w-2 rounded-full ${color}`} />
    </span>
  );
}
