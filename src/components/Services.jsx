import { SERVICES } from "../data/index.js";
import Reveal from "./Reveal.jsx";
import "./Services.css";

export default function Services() {
  return (
    <section id="services">
      <Reveal>
        <div className="sec-head">
          <div>
            <div className="sec-label">What We Do</div>
            <h2 className="sec-title">Our <em>Services</em></h2>
          </div>
        </div>
      </Reveal>

      <div className="services-grid">
        {SERVICES.map((s, i) => (
          <Reveal key={s.title} delay={i * 0.07}>
            <div className="svc-card">
              <span className="svc-icon">{s.icon}</span>
              <h3 className="svc-title">{s.title}</h3>
              <p className="svc-desc">{s.desc}</p>
              <div className="svc-tags">
                {s.tags.map((t) => (
                  <span className="tag" key={t}>{t}</span>
                ))}
              </div>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
