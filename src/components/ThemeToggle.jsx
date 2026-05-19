import "./ThemeToggle.css";

/**
 * ThemeToggle
 * Single button — shows 🌙 in dark mode, ☀️ in light mode
 * Click toggles theme with a smooth vertical slide animation
 */
export default function ThemeToggle({ dark, setDark }) {
  return (
    <button
      className="tt-btn"
      onClick={() => setDark((d) => !d)}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      title={dark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div className="tt-track">
        {/* Dark icon — moon */}
        <span className={`tt-icon tt-moon ${dark ? "tt-visible" : "tt-hidden-up"}`}>
          🌙
        </span>
        {/* Light icon — sun */}
        <span className={`tt-icon tt-sun ${!dark ? "tt-visible" : "tt-hidden-down"}`}>
          ☀️
        </span>
      </div>
    </button>
  );
}
