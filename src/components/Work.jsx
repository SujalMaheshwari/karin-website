import { useNavigate } from "react-router-dom";
import { PROJECTS } from "../data/index.js";
import { CASE_STUDIES } from "../data/caseStudies.js";
import Reveal from "./Reveal.jsx";
import "./Work.css";

export default function Work() {
  const navigate = useNavigate();

  // Merge project list with case study images
  const projects = PROJECTS.map((p) => {
    const cs = CASE_STUDIES.find((c) => c.id === p.id);
    return { ...p, image: cs?.image, imageAlt: cs?.imageAlt };
  });

  return (
    <div className="work-bg">
      <div className="work-inner" id="work">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">Case Studies</div>
              <h2 className="sec-title">Selected <em>Work</em></h2>
            </div>
          </div>
          <p className="work-subtitle">
            Selected Internal Builds &amp; Product Concepts
          </p>
        </Reveal>

        <div className="projects-list">
          {projects.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div
                className="proj-row"
                style={{ "--proj-color": p.color }}
                onClick={() => navigate(`/work/${p.id}`)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && navigate(`/work/${p.id}`)}
              >
                {/* Thumbnail preview */}
                {p.image && (
                  <div className="proj-thumb">
                    <img src={p.image} alt={p.imageAlt || p.title} />
                  </div>
                )}

                <div className="proj-info">
                  <div className="proj-type">{p.type}</div>
                  <div className="proj-name">{p.title}</div>
                  <div className="proj-desc">{p.desc}</div>
                  <div className="proj-tags">
                    {p.tags.map((t) => (
                      <span className="proj-tag" key={t}>{t}</span>
                    ))}
                  </div>
                </div>

                <div className="proj-right">
                  <div className="proj-cat">{p.category}</div>
                  <div className="proj-year">{p.year}</div>
                  <div className="proj-arrow">→</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </div>
  );
}
