import Reveal from "./Reveal.jsx";
import "./Team.css";

const STUDIO_STATS = [
  { value: "3",    label: "Engineers"      },
  { value: "4+",   label: "Products Built" },
  { value: "2025", label: "Founded"        },
  { value: "∞",    label: "Cups of Coffee" },
];

export default function Team() {
  return (
    <div className="team-bg">
      <section id="team" className="team-section">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">The Studio</div>
              <h2 className="sec-title">Built by <em>Engineers</em></h2>
            </div>
            <p className="team-tagline">
              Small team. Sharp focus.<br />No fluff, just craft.
            </p>
          </div>
        </Reveal>

        <div className="team-layout">

          {/* LEFT — Director card */}
          <Reveal delay={0.05}>
            <div className="team-director-card">
              <div className="team-director-avatar">KU</div>
              <div className="team-director-info">
                <div className="team-director-label">Founding Director</div>
                <h3 className="team-director-name">Kaushiki Upadhyaya</h3>
                <p className="team-director-bio">
                  Leads strategy, client relationships, and product vision at KARIN.
                  Obsessed with turning complex problems into clean, working software.
                </p>
              </div>
              <div className="team-director-corner" />
            </div>
          </Reveal>

          {/* RIGHT — Stats + manifesto */}
          <div className="team-right">
            <Reveal delay={0.1}>
              <div className="team-studio-label">Studio at a glance</div>
            </Reveal>

            <div className="team-stats-grid">
              {STUDIO_STATS.map((s, i) => (
                <Reveal key={s.label} delay={0.12 + i * 0.07}>
                  <div className="team-stat">
                    <span className="team-stat-val">{s.value}</span>
                    <span className="team-stat-lbl">{s.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            <Reveal delay={0.38}>
              <div className="team-manifesto">
                <p>
                  We believe great software comes from engineers who care —
                  about the code, the product, and the person using it.
                  KARIN is built on that belief.
                </p>
                <div className="team-manifesto-line" />
                <span className="team-manifesto-loc">◎ Bhopal, India · Est. 2025</span>
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </div>
  );
}
