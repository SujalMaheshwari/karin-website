import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { getCaseStudy, CASE_STUDIES } from "../../data/caseStudies.js";
import "./CaseStudy.css";

export default function CaseStudy() {
  const { id }   = useParams();
  const navigate = useNavigate();
  const study    = getCaseStudy(id);

  useEffect(() => { window.scrollTo(0, 0); }, [id]);

  if (!study) {
    return (
      <div className="cs-notfound">
        <h2>Case study not found</h2>
        <button onClick={() => navigate("/")} className="cs-back-btn">← Back to Home</button>
      </div>
    );
  }

  const currentIndex = CASE_STUDIES.findIndex((c) => c.id === id);
  const next         = CASE_STUDIES[(currentIndex + 1) % CASE_STUDIES.length];

  return (
    <div className="cs-page">

      {/* ── TOP BAR ── */}
      <div className="cs-topbar">
        <button className="cs-back" onClick={() => navigate("/")}>← Back</button>
        <span className="cs-breadcrumb">Work / {study.title}</span>
      </div>

      {/* ── HERO ── */}
      <header className="cs-hero" style={{ "--cs-color": study.color }}>
        <div className="cs-hero-inner">
          <div className="cs-meta-row">
            <span className="cs-type">{study.type}</span>
            <span className="cs-sep">·</span>
            <span className="cs-cat">{study.category}</span>
            <span className="cs-sep">·</span>
            <span className="cs-year">{study.year}</span>
          </div>

          <h1 className="cs-title">{study.title}</h1>
          <p className="cs-summary">{study.summary}</p>

          {/* Quick stats */}
          <div className="cs-stats">
            <div className="cs-stat">
              <span className="cs-stat-val">{study.duration}</span>
              <span className="cs-stat-lbl">Duration</span>
            </div>
            <div className="cs-stat">
              <span className="cs-stat-val">{study.stack.length}</span>
              <span className="cs-stat-lbl">Technologies</span>
            </div>
            <div className="cs-stat">
              <span className="cs-stat-val">{study.outcomes.length}</span>
              <span className="cs-stat-lbl">Key Outcomes</span>
            </div>
          </div>
        </div>
        <div className="cs-hero-bar" />
      </header>

      {/* ── PROJECT IMAGE ── */}
      <div className="cs-image-wrap">
        <div className="cs-image-inner">
          <img
            src={study.image}
            alt={study.imageAlt}
            className="cs-project-image"
            loading="lazy"
          />
          <div className="cs-image-caption"
            style={{ borderColor: study.color }}>
            <span className="cs-image-dot" style={{ background: study.color }} />
            {study.imageAlt}
          </div>
        </div>
      </div>

      {/* ── CONTENT ── */}
      <div className="cs-content">

        {/* Tech Stack */}
        <section className="cs-section">
          <div className="cs-section-label">Tech Stack</div>
          <div className="cs-stack-pills">
            {study.stack.map((t) => (
              <span className="cs-pill" key={t} style={{ "--cs-color": study.color }}>
                {t}
              </span>
            ))}
          </div>
        </section>

        <div className="cs-divider-line" />

        {/* Problem */}
        <section className="cs-section cs-grid">
          <div className="cs-section-label">The Problem</div>
          <p className="cs-body">{study.problem}</p>
        </section>

        <div className="cs-divider-line" />

        {/* Goals */}
        <section className="cs-section cs-grid">
          <div className="cs-section-label">Goals</div>
          <ul className="cs-list">
            {study.goals.map((g, i) => (
              <li key={i}>
                <span className="cs-list-dot" style={{ background: study.color }} />
                {g}
              </li>
            ))}
          </ul>
        </section>

        <div className="cs-divider-line" />

        {/* Approach */}
        <section className="cs-section cs-grid">
          <div className="cs-section-label">Our Approach</div>
          <p className="cs-body">{study.approach}</p>
        </section>

        <div className="cs-divider-line" />

        {/* Challenges */}
        <section className="cs-section cs-grid">
          <div className="cs-section-label">Key Challenge</div>
          <p className="cs-body">{study.challenges}</p>
        </section>

        <div className="cs-divider-line" />

        {/* Outcomes */}
        <section className="cs-section cs-grid">
          <div className="cs-section-label">Outcomes</div>
          <div className="cs-outcomes">
            {study.outcomes.map((o, i) => (
              <div className="cs-outcome-card" key={i} style={{ "--cs-color": study.color }}>
                <span className="cs-outcome-num">0{i + 1}</span>
                <p>{o}</p>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* ── NEXT PROJECT ── */}
      <div
        className="cs-next"
        onClick={() => navigate(`/work/${next.id}`)}
        style={{ "--cs-color": next.color }}
      >
        {/* Next project preview image */}
        {next.image && (
          <div className="cs-next-preview">
            <img src={next.image} alt={next.title} />
          </div>
        )}
        <div className="cs-next-inner">
          <div>
            <span className="cs-next-label">Next Project</span>
            <h3 className="cs-next-title">{next.title}</h3>
            <span className="cs-next-cat">{next.category}</span>
          </div>
          <span className="cs-next-arrow">→</span>
        </div>
      </div>

    </div>
  );
}
