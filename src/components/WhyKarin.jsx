import Reveal from "./Reveal.jsx";
import "./WhyKarin.css";

const REASONS = [
  {
    icon: "⚡",
    title: "Fast Delivery",
    metric: "4–8 wks",
    desc: "From kickoff to production-ready MVP. No endless sprints, no scope creep — just focused execution.",
  },
  {
    icon: "◈",
    title: "Scalable Architecture",
    metric: "Production-grade",
    desc: "Every system we build is designed to grow with you. Clean code, documented APIs, zero shortcuts.",
  },
  {
    icon: "◻",
    title: "AI-First Workflows",
    metric: "LLM-ready",
    desc: "We integrate AI where it genuinely helps — not as a gimmick, but as a core product capability.",
  },
  {
    icon: "◉",
    title: "Full Ownership",
    metric: "100% yours",
    desc: "Source code, repos, credentials — everything transfers to you. No vendor lock-in, ever.",
  },
];

export default function WhyKarin() {
  return (
    <div className="wk-bg">
      <section id="why" className="wk-section">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">Why KARIN</div>
              <h2 className="sec-title">Built With <em>Precision</em></h2>
            </div>
            <p className="wk-sub">
              What makes working with us<br />different from the rest.
            </p>
          </div>
        </Reveal>

        <div className="wk-grid">
          {REASONS.map((r, i) => (
            <Reveal key={r.title} delay={i * 0.09}>
              <div className="wk-card">
                <div className="wk-top">
                  <span className="wk-icon">{r.icon}</span>
                  <span className="wk-metric">{r.metric}</span>
                </div>
                <h3 className="wk-title">{r.title}</h3>
                <p className="wk-desc">{r.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
