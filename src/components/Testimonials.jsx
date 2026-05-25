import { useSiteContent } from "../hooks/useSiteContent.js";
import Reveal from "./Reveal.jsx";
import "./Testimonials.css";

export default function Testimonials() {
  const { content } = useSiteContent();
  const testimonials = content.testimonials;

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
          {testimonials.map((t, i) => (
            <Reveal key={t._id || t.name} delay={i * 0.1}>
              <div className="testi-card">
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