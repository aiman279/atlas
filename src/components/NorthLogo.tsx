export function NorthLogo({ size = 28 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      aria-hidden
      className="north-logo"
    >
      <rect width="40" height="40" rx="10" fill="var(--bg-elev)" />
      <rect
        width="40"
        height="40"
        rx="10"
        stroke="var(--line)"
        strokeWidth="1"
      />
      <circle
        cx="20"
        cy="20"
        r="13.5"
        stroke="var(--accent)"
        strokeWidth="1.4"
        opacity="0.4"
      />
      <path d="M20 8 L24.2 20 L20 17.6 L15.8 20 Z" fill="var(--accent)" />
      <path
        d="M20 32 L24.2 20 L20 22.4 L15.8 20 Z"
        fill="var(--accent)"
        opacity="0.28"
      />
      <circle cx="20" cy="20" r="2" fill="var(--accent)" />
      <circle cx="20" cy="10.2" r="1.1" fill="var(--accent)" />
    </svg>
  );
}
