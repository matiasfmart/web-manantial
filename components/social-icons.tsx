type SocialPlatform = "whatsapp" | "instagram" | "youtube" | "facebook" | "tiktok";

export function SocialBrandIcon({
  platform,
  className = "h-4 w-4",
}: {
  platform: SocialPlatform;
  className?: string;
}) {
  const common = {
    className,
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  switch (platform) {
    case "whatsapp":
      return (
        <svg {...common}>
          <path d="M5.2 18.9 6 15.7a7.4 7.4 0 1 1 2.8 2.6l-3.6.6Z" />
          <path d="M9.4 8.9c.2-.4.4-.4.7-.4h.5c.2 0 .4.1.5.4l.7 1.6c.1.2.1.4 0 .6l-.5.7c-.1.1-.1.3 0 .5.4.8 1.2 1.5 2.1 2 .2.1.4.1.5-.1l.7-.8c.2-.2.4-.2.6-.1l1.6.8c.3.1.4.3.4.5 0 .6-.4 1.4-.9 1.7-.6.3-1.8.4-3.6-.5-2.7-1.3-4.4-3.9-4.5-5.8 0-.6.6-1.6 1.2-1.9Z" />
        </svg>
      );
    case "instagram":
      return (
        <svg {...common}>
          <rect x="4" y="4" width="16" height="16" rx="4.5" />
          <circle cx="12" cy="12" r="3.4" />
          <circle cx="16.7" cy="7.3" r=".7" fill="currentColor" stroke="none" />
        </svg>
      );
    case "youtube":
      return (
        <svg {...common}>
          <path d="M21 12s0-3.4-.5-5c-.3-.8-.9-1.4-1.7-1.6C17.3 5 12 5 12 5s-5.3 0-6.8.4C4.4 5.6 3.8 6.2 3.5 7 3 8.6 3 12 3 12s0 3.4.5 5c.3.8.9 1.4 1.7 1.6 1.5.4 6.8.4 6.8.4s5.3 0 6.8-.4c.8-.2 1.4-.8 1.7-1.6.5-1.6.5-5 .5-5Z" />
          <path d="m10.4 9.2 4.4 2.8-4.4 2.8V9.2Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "facebook":
      return (
        <svg {...common}>
          <path d="M14 8.2h2V5.1c-.9-.1-1.8-.2-2.7-.2-2.6 0-4.3 1.5-4.3 4.2v2.3H6.5V15H9v6h3.7v-6h2.8l.5-3.6h-3.3V9.5c0-.9.4-1.3 1.3-1.3Z" fill="currentColor" stroke="none" />
        </svg>
      );
    case "tiktok":
      return (
        <svg {...common}>
          <path d="M14.2 4v10.3a4.5 4.5 0 1 1-4.5-4.5c.4 0 .8.1 1.1.2v3.1a1.7 1.7 0 1 0 1.1 1.6V4h2.3Z" />
          <path d="M14.2 4c.6 2.4 2.1 3.8 4.3 4.1v3.1c-1.6-.1-3-.6-4.3-1.6" />
        </svg>
      );
  }
}

export function SocialCircleLink({
  href,
  label,
  platform,
  variant = "dark",
}: {
  href: string;
  label: string;
  platform: SocialPlatform;
  variant?: "dark" | "light";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
      className={`flex h-9 w-9 items-center justify-center rounded-full border transition duration-200 hover:-translate-y-0.5 hover:border-brand hover:text-brand ${
        variant === "light" ? "border-ink/15 text-ink/65" : "border-white/15 text-white/70"
      }`}
    >
      <SocialBrandIcon platform={platform} />
    </a>
  );
}

export function SocialTextLink({
  href,
  label,
  platform,
  variant = "dark",
}: {
  href: string;
  label: string;
  platform: SocialPlatform;
  variant?: "dark" | "light";
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={
        variant === "light"
          ? "btn-secondary !py-2.5 !px-5 text-xs"
          : "btn-secondary !py-2.5 !px-5 text-xs"
      }
    >
      <SocialBrandIcon platform={platform} />
      {label}
    </a>
  );
}
