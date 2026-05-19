import { TESTIMONIALS } from "../data/index.js";
import Reveal from "./Reveal.jsx";
import "./Testimonials.css";

export default function Testimonials() {
  return (
    <div className="testi-bg">
      <section id="testimonials" className="testi-section">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">Kind Words</div>
              <h2 className="sec-title">What Clients <em>Say</em></h2>
            </div>
          </div>
        </Reveal>

        <div className="testi-grid">
          {TESTIMONIALS.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.1}>
              <div className="testi-card">
                {/* Single proper opening double-quote character */}
                <span className="testi-quote">&ldquo;</span>
                <p className="testi-text">{t.quote}</p>
                <div className="testi-author">
                  <div className="testi-avatar">{t.initial}</div>
                  <div>
                    <div className="testi-name">{t.name}</div>
                    <div className="testi-role">{t.role} · {t.company}</div>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
