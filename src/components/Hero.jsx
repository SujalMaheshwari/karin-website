import "./Hero.css";

export default function Hero({ scrollTo }) {
  return (
    <div className="hero-wrap" id="hero">
      <div className="hero-grid" />

      <div className="hero-inner">
        {/* ── LEFT: Content ── */}
        <div className="hero-left">
          <p className="hero-eyebrow">Software Development Studio · Bhopal, India</p>

          <h1 className="hero-h1">
            Turning<br />
            <em>Ideas</em> Into<br />
            <span className="hilight">Products.</span>
          </h1>

          <p className="hero-sub">
            KARIN Pvt. Ltd. is a focused engineering studio building
            full-stack web apps, mobile experiences, and AI-powered
            products — from concept to launch.
          </p>

          <div className="hero-btns">
            <a href="#" className="btn-primary"
              onClick={(e) => { e.preventDefault(); scrollTo("contact"); }}>
              Let's Build Together →
            </a>
            <a href="#" className="btn-ghost"
              onClick={(e) => { e.preventDefault(); scrollTo("work"); }}>
              See Our Work
            </a>
          </div>

          <div className="hero-loc">Bhopal, Madhya Pradesh, India</div>
        </div>

        {/* ── RIGHT: Animated visual ── */}
        <div className="hero-right">
          <div className="hero-visual">

            {/* Outer glow ring */}
            <div className="hv-ring hv-ring-1" />
            <div className="hv-ring hv-ring-2" />
            <div className="hv-ring hv-ring-3" />

            {/* Main sphere */}
            <div className="hv-sphere">
              <div className="hv-sphere-inner" />
              <div className="hv-sphere-shine" />
            </div>

            {/* Floating UI chips */}
            <div className="hv-chip hv-chip-1">
              <span className="hv-chip-dot" />
              <span>React · Node.js</span>
            </div>
            <div className="hv-chip hv-chip-2">
              <span className="hv-chip-dot" />
              <span>LLM Integration</span>
            </div>
            <div className="hv-chip hv-chip-3">
              <span className="hv-chip-dot" />
              <span>MVP in 6 weeks</span>
            </div>

            {/* Orbiting dot */}
            <div className="hv-orbit">
              <div className="hv-orbit-dot" />
            </div>

          </div>
        </div>
      </div>

      <div className="hero-loc hero-loc-mobile">Bhopal, Madhya Pradesh, India</div>
    </div>
  );
}
