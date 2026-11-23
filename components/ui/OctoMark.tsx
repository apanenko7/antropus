/**
 * Brand mark: an octopus whose head is the orange triangle.
 * Plain colours (no CSS variables) so the same drawing works as app/icon.svg.
 * `id` keeps gradient ids unique when the mark is rendered more than once on a page.
 */
export function OctoMark({ size = 40, id = "octo", className }: { size?: number; id?: string; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id={`${id}-head`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#ffb057" />
          <stop offset="1" stopColor="#ff6b00" />
        </linearGradient>
        <linearGradient id={`${id}-arm`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#ff7a10" />
          <stop offset="1" stopColor="#e05a00" />
        </linearGradient>
      </defs>
      {/* Tentacles (behind the head) */}
      <g fill="none" stroke={`url(#${id}-arm)`} strokeWidth="9" strokeLinecap="round">
        <path d="M30 70 C20 86 36 94 24 108 c-4 4 -10 2 -9 -3" />
        <path d="M45 74 C40 92 54 98 45 112" />
        <path d="M60 76 C62 94 52 100 60 114" />
        <path d="M75 74 C80 92 66 98 75 112" />
        <path d="M90 70 C100 86 84 94 96 108 c4 4 10 2 9 -3" />
      </g>
      {/* Head: rounded triangle */}
      <path
        d="M52.4 12.6 a8.8 8.8 0 0 1 15.2 0 l38.1 64.6 a8.8 8.8 0 0 1 -7.6 13.3 H21.9 a8.8 8.8 0 0 1 -7.6 -13.3 Z"
        fill={`url(#${id}-head)`}
      />
      {/* Shine */}
      <path d="M50 26 L35 52" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="47" cy="62" r="9" fill="#fff" />
      <circle cx="73" cy="62" r="9" fill="#fff" />
      <circle cx="49.5" cy="60" r="4.2" fill="#1c1d20" />
      <circle cx="75.5" cy="60" r="4.2" fill="#1c1d20" />
      <circle cx="51" cy="58.5" r="1.4" fill="#fff" />
      <circle cx="77" cy="58.5" r="1.4" fill="#fff" />
      {/* Smile */}
      <path d="M54 76 q6 5 12 0" fill="none" stroke="#1c1d20" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
