const paths: Record<string, string> = {
  flame:
    "M12 2c1 3-2 4-2 7a4 4 0 108 0c0-1-.5-2-1-2 1 4-1 5-2 5-2 0-3-1.5-3-3.5C12 6 13 4 12 2zM7 14a5 5 0 0010 0c0-2-1-3-1-5-3 1-4 3-4 5a2 2 0 01-4 0c0-1 .5-2 1-3-1.5 1-2 2-2 3z",
  sun: "M12 4V2m0 20v-2m8-8h2M2 12h2m14.14-6.14l1.4-1.4M4.46 19.54l1.4-1.4M17.54 17.54l1.4 1.4M4.46 4.46l1.4 1.4M12 7a5 5 0 100 10 5 5 0 000-10z",
  book: "M4 4.5A2.5 2.5 0 016.5 2H20v17H6.5A2.5 2.5 0 004 16.5v-12zM4 16.5V19a2 2 0 002 2h14",
  seedling:
    "M12 22v-9m0 0c0-4-3-6-7-6 0 4 2 7 7 7zm0-2c0-5 3-8 8-8 0 5-3 8-8 8z",
  star: "M12 2l2.9 6.3 6.9.6-5.2 4.6 1.6 6.8L12 16.9 5.8 20.3l1.6-6.8-5.2-4.6 6.9-.6L12 2z",
  megaphone:
    "M3 11v2a2 2 0 002 2h1l3 6 2-1-2.5-5H12l7 4V5l-7 4H8l-3-1a2 2 0 00-2 2z",
  users:
    "M17 20h5v-2a4 4 0 00-3-3.87M9 20H4v-2a4 4 0 013-3.87m5-2.13a4 4 0 100-8 4 4 0 000 8zm7 1a4 4 0 10-4-4",
};

export default function MinistryIcon({
  icon,
  className = "h-6 w-6",
}: {
  icon: string;
  className?: string;
}) {
  const d = paths[icon] ?? paths.star;
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d={d} />
    </svg>
  );
}
