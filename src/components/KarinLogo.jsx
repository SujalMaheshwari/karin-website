import karinMark from "../assets/karin-mark.svg";

/**
 * KarinLogo — Uses the real KARIN KA mark SVG
 * The SVG has transparent background — blends into any theme
 *
 * Props:
 *   size     (number) — height in px, default 36
 *   showText (bool)   — show wordmark beside it
 *   dark     (bool)   — switches wordmark color
 */
export default function KarinLogo({ size = 36, showText = false, dark = true }) {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: size * 0.3 + "px",
    }}>
      {/* Real KA mark — transparent, no white box */}
      <img
        src={karinMark}
        alt="KARIN logo mark"
        height={size}
        width={size}
        style={{
          display: "block",
          flexShrink: 0,
          // No background, no border, no padding
          background: "transparent",
          border: "none",
          objectFit: "contain",
        }}
      />

      {/* Wordmark */}
      {showText && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          gap: "1px",
        }}>
          <div style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: size * 0.72 + "px",
            letterSpacing: "-0.01em",
            color: dark ? "#eef0f5" : "#111a09",
            lineHeight: 1,
            transition: "color 0.4s",
          }}>
            KARIN
          </div>
          <div style={{
            fontFamily: "'DM Mono', monospace",
            fontSize: size * 0.28 + "px",
            letterSpacing: "0.12em",
            color: dark ? "#525870" : "#3d4d2e",
            textTransform: "uppercase",
            lineHeight: 1,
            transition: "color 0.4s",
          }}>
            Pvt. Ltd.
          </div>
        </div>
      )}
    </div>
  );
}
