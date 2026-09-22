/* ByteGeist custom SVG art
   Hand-authored, not clip-art. Monochrome + accent so it themes
   cleanly with the dark navy shell. */

export const BrandMark = ({ size = 40 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 40 40"
    aria-hidden="true"
    className="bg-brand-mark"
  >
    <defs>
      <linearGradient id="bg-mark-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#60a5fa" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    {/* rounded byte-ghost body with wave bottom */}
    <path
      d="M8 14
         C8 9, 12 6, 20 6
         C28 6, 32 9, 32 14
         L32 30
         L28.5 27
         L25 30
         L21.5 27
         L18 30
         L14.5 27
         L11 30
         L8 27
         Z"
      fill="url(#bg-mark-body)"
      stroke="#93c5fd"
      strokeWidth="0.5"
    />
    {/* single pixel eye */}
    <rect x="17" y="14" width="4" height="4" rx="0.5" fill="#0b1220" />
    {/* underscore cursor */}
    <rect x="23" y="18" width="4" height="1.5" rx="0.5" fill="#0b1220" />
  </svg>
);

/* Hero illustration: isometric ticket + console composition.
   Sits behind the hero copy. Layers depth without gradient slop. */
export const HeroArt = () => (
  <svg
    viewBox="0 0 480 320"
    className="bg-hero-art"
    aria-hidden="true"
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      {/* thin grid pattern */}
      <pattern id="bg-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M 20 0 L 0 0 0 20"
          fill="none"
          stroke="rgba(148,163,184,0.08)"
          strokeWidth="1"
        />
      </pattern>
      <linearGradient id="bg-cardsurf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#1a2942" />
        <stop offset="1" stopColor="#111c2e" />
      </linearGradient>
      <linearGradient id="bg-termsurf" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#0f1a2c" />
        <stop offset="1" stopColor="#060c18" />
      </linearGradient>
      <linearGradient id="bg-glowline" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0" stopColor="#38bdf8" stopOpacity="0" />
        <stop offset="0.5" stopColor="#38bdf8" stopOpacity="1" />
        <stop offset="1" stopColor="#38bdf8" stopOpacity="0" />
      </linearGradient>
    </defs>

    {/* backdrop grid, softly clipped */}
    <mask id="bg-fade">
      <rect width="480" height="320" fill="url(#bg-grid-alpha)" />
    </mask>
    <rect width="480" height="320" fill="url(#bg-grid)" opacity="0.6" />

    {/* schematic corner brackets */}
    <g stroke="rgba(59,130,246,0.35)" strokeWidth="1.25" fill="none">
      <path d="M 12 24 L 12 12 L 24 12" />
      <path d="M 468 24 L 468 12 L 456 12" />
      <path d="M 12 296 L 12 308 L 24 308" />
      <path d="M 468 296 L 468 308 L 456 308" />
    </g>

    {/* isometric group */}
    <g transform="translate(60 40)">
      {/* ticket card, back layer */}
      <g transform="translate(30 20) skewY(-10)">
        <rect width="180" height="110" rx="8" fill="url(#bg-cardsurf)"
              stroke="rgba(148,163,184,0.18)" />
        {/* ticket id row */}
        <rect x="14" y="14" width="46" height="16" rx="3"
              fill="rgba(56,189,248,0.14)" stroke="rgba(56,189,248,0.35)" />
        <rect x="66" y="18" width="46" height="8" rx="2" fill="rgba(148,163,184,0.28)" />
        {/* title bar */}
        <rect x="14" y="38" width="150" height="10" rx="2" fill="rgba(226,232,240,0.7)" />
        {/* body lines */}
        <rect x="14" y="56" width="140" height="5" rx="2" fill="rgba(148,163,184,0.28)" />
        <rect x="14" y="66" width="120" height="5" rx="2" fill="rgba(148,163,184,0.24)" />
        <rect x="14" y="76" width="100" height="5" rx="2" fill="rgba(148,163,184,0.2)" />
        {/* CTA pill */}
        <rect x="14" y="88" width="60" height="12" rx="3"
              fill="rgba(59,130,246,0.85)" />
      </g>

      {/* terminal window, front layer, offset up-right */}
      <g transform="translate(160 100) skewY(-10)">
        <rect width="200" height="130" rx="10" fill="url(#bg-termsurf)"
              stroke="rgba(59,130,246,0.35)" />
        {/* header strip */}
        <rect width="200" height="20" rx="10" fill="rgba(15,26,44,0.9)" />
        <rect y="10" width="200" height="10" fill="rgba(15,26,44,0.9)" />
        {/* mono column index */}
        <g fontFamily="ui-monospace, monospace" fontSize="9" fill="#64748b">
          <text x="12" y="42">01</text>
          <text x="12" y="60">02</text>
          <text x="12" y="78">03</text>
          <text x="12" y="96">04</text>
        </g>
        {/* prompt + commands */}
        <g fontFamily="ui-monospace, monospace" fontSize="10">
          <text x="34" y="42" fill="#38bdf8">$</text>
          <text x="44" y="42" fill="#e2e8f0">aws sts get-caller-identity</text>
          <text x="34" y="60" fill="#38bdf8">$</text>
          <text x="44" y="60" fill="#e2e8f0">aws s3 ls s3://bytegeist-reports</text>
          <text x="34" y="78" fill="#f87171">AccessDenied</text>
          <text x="34" y="96" fill="#38bdf8">$</text>
          <text x="44" y="96" fill="#94a3b8">_</text>
        </g>
        {/* status leds */}
        <circle cx="184" cy="10" r="2.5" fill="#22c55e" />
        <circle cx="176" cy="10" r="2.5" fill="#f59e0b" opacity="0.7" />
        <circle cx="168" cy="10" r="2.5" fill="#f87171" opacity="0.6" />
      </g>

      {/* connecting glow line between ticket and terminal */}
      <path
        d="M 130 90 C 180 60, 220 40, 260 20"
        stroke="url(#bg-glowline)"
        strokeWidth="1.25"
        fill="none"
      />
      {/* floating brand mark near the join */}
      <g transform="translate(238 -4)">
        <circle r="14" fill="rgba(59,130,246,0.14)"
                stroke="rgba(59,130,246,0.45)" />
        <path
          d="M -6 -4 C -6 -8, -3 -10, 0 -10 C 3 -10, 6 -8, 6 -4 L 6 6
             L 4 4 L 2 6 L 0 4 L -2 6 L -4 4 L -6 6 Z"
          fill="#93c5fd"
        />
        <rect x="-2" y="-4" width="2" height="2" fill="#0b1220" />
      </g>
    </g>
  </svg>
);

/* Coach mascot for empty state.
   The ghost with a terminal-cursor eye. Sitting on a shelf line. */
export const CoachMascot = () => (
  <svg
    viewBox="0 0 120 96"
    className="bg-coach-mascot"
    aria-hidden="true"
  >
    <defs>
      <linearGradient id="bg-mascot-body" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#7dd3fc" />
        <stop offset="1" stopColor="#2563eb" />
      </linearGradient>
    </defs>
    {/* ground shadow */}
    <ellipse cx="60" cy="86" rx="26" ry="3" fill="rgba(0,0,0,0.35)" />
    {/* body */}
    <path
      d="M 30 44
         C 30 28, 42 20, 60 20
         C 78 20, 90 28, 90 44
         L 90 78
         L 84 72 L 78 78 L 72 72 L 66 78 L 60 72 L 54 78 L 48 72 L 42 78 L 36 72 L 30 78 Z"
      fill="url(#bg-mascot-body)"
      stroke="#bfdbfe"
      strokeWidth="0.75"
    />
    {/* eyes: one solid, one blinking cursor */}
    <rect x="48" y="38" width="6" height="6" rx="1" fill="#0b1220" />
    <rect x="66" y="38" width="6" height="6" rx="1" fill="#0b1220">
      <animate
        attributeName="opacity"
        values="1;1;0;1"
        keyTimes="0;0.85;0.92;1"
        dur="3.6s"
        repeatCount="indefinite"
      />
    </rect>
    {/* underscore mouth cursor */}
    <rect x="52" y="52" width="16" height="2.5" rx="1" fill="#0b1220">
      <animate
        attributeName="opacity"
        values="1;1;0.4;1"
        dur="1.8s"
        repeatCount="indefinite"
      />
    </rect>
    {/* tiny antenna dot */}
    <line x1="60" y1="20" x2="60" y2="12" stroke="#93c5fd" strokeWidth="1" />
    <circle cx="60" cy="10" r="2" fill="#38bdf8">
      <animate
        attributeName="r"
        values="2;2.5;2"
        dur="2s"
        repeatCount="indefinite"
      />
    </circle>
  </svg>
);
