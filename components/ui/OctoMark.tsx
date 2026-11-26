/**
 * Brand mark: an octopus whose head is the lime triangle.
 * Plain colours (no CSS variables) so the same drawing works as app/icon.svg.
 * `id` keeps gradient ids unique when the mark is rendered more than once on a page.
 * `animated` makes it bob, sway its tentacles and blink (CSS in globals.css).
 */
export function OctoMark({
  size = 40,
  id = "octo",
  className,
  animated = false,
}: {
  size?: number;
  id?: string;
  className?: string;
  animated?: boolean;
}) {
  const arm = (i: number) => (animated ? { className: "octo-arm", style: { animationDelay: `${i * -0.45}s` } } : {});
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      className={[className, animated ? "octo-bob" : ""].filter(Boolean).join(" ")}
      aria-hidden="true"
      focusable="false"
      overflow="visible"
    >
      <defs>
        <linearGradient id={`${id}-head`} x1="0.2" y1="0" x2="0.8" y2="1">
          <stop offset="0" stopColor="#c4e38f" />
          <stop offset="1" stopColor="#78a83c" />
        </linearGradient>
        <linearGradient id={`${id}-arm`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#93bf55" />
          <stop offset="1" stopColor="#5d8a2b" />
        </linearGradient>
      </defs>
      {/* Tentacles (behind the head) */}
      <g fill="none" stroke={`url(#${id}-arm)`} strokeWidth="9" strokeLinecap="round">
        <path d="M30 70 C20 86 36 94 24 108 c-4 4 -10 2 -9 -3" {...arm(0)} />
        <path d="M45 74 C40 92 54 98 45 112" {...arm(1)} />
        <path d="M60 76 C62 94 52 100 60 114" {...arm(2)} />
        <path d="M75 74 C80 92 66 98 75 112" {...arm(3)} />
        <path d="M90 70 C100 86 84 94 96 108 c4 4 10 2 9 -3" {...arm(4)} />
      </g>
      {/* Head: rounded triangle */}
      <path
        d="M52.4 12.6 a8.8 8.8 0 0 1 15.2 0 l38.1 64.6 a8.8 8.8 0 0 1 -7.6 13.3 H21.9 a8.8 8.8 0 0 1 -7.6 -13.3 Z"
        fill={`url(#${id}-head)`}
      />
      {/* Shine */}
      <path d="M50 26 L35 52" stroke="#fff" strokeOpacity="0.35" strokeWidth="5" strokeLinecap="round" />
      {/* Eyes */}
      <g className={animated ? "octo-eyes" : undefined}>
        <circle cx="47" cy="62" r="9" fill="#fff" />
        <circle cx="73" cy="62" r="9" fill="#fff" />
        <circle cx="49.5" cy="60" r="4.2" fill="#1c1d20" />
        <circle cx="75.5" cy="60" r="4.2" fill="#1c1d20" />
        <circle cx="51" cy="58.5" r="1.4" fill="#fff" />
        <circle cx="77" cy="58.5" r="1.4" fill="#fff" />
      </g>
      {/* Smile */}
      <path d="M54 76 q6 5 12 0" fill="none" stroke="#1c1d20" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}
