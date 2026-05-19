import { useRef, useState } from "react";
import { HOW_WE_WORK } from "../data/index.js";
import Reveal from "./Reveal.jsx";
import "./HowWeWork.css";

export default function HowWeWork() {
  const [active, setActive] = useState(0);
  const swipeStart  = useRef(null);
  const swipeIntent = useRef(null); // "h" | "v" | null
  const total = HOW_WE_WORK.length;

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  const handlePointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    swipeStart.current  = { x: e.clientX, y: e.clientY };
    swipeIntent.current = null;
    e.currentTarget.setPointerCapture?.(e.pointerId);
  };

  const handlePointerMove = (e) => {
    if (!swipeStart.current) return;
    const dx = Math.abs(e.clientX - swipeStart.current.x);
    const dy = Math.abs(e.clientY - swipeStart.current.y);

    // Determine intent once we have enough movement
    if (!swipeIntent.current && (dx > 6 || dy > 6)) {
      swipeIntent.current = dx > dy ? "h" : "v";
    }

    // Only block scroll once we know it's horizontal
    if (swipeIntent.current === "h") {
      e.preventDefault();
    }
  };

  const handlePointerUp = (e) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x;
    const dy = e.clientY - swipeStart.current.y;
    swipeStart.current  = null;
    swipeIntent.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);

    if (Math.abs(dx) < 45 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
    if (dx < 0) next();
    else prev();
  };

  const handlePointerCancel = (e) => {
    swipeStart.current  = null;
    swipeIntent.current = null;
    e.currentTarget.releasePointerCapture?.(e.pointerId);
  };

  const getPos = (i) => {
    let diff = i - active;
    if (diff < -(total / 2)) diff += total;
    if (diff > total / 2)    diff -= total;
    return diff;
  };

  return (
    <div className="hww-bg">
      <section id="process" className="hww-section">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">Our Process</div>
              <h2 className="sec-title">How We <em>Work</em></h2>
            </div>
            <p className="hww-sub">
              A clear, structured process that keeps you informed
              and in control at every stage.
            </p>
          </div>
        </Reveal>

        {/* ── CAROUSEL ── */}
        <div className="hww-carousel-wrap">
          <button className="hww-arrow hww-arrow-left" onClick={prev} aria-label="Previous">←</button>

          <div
            className="hww-track"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {HOW_WE_WORK.map((item, i) => {
              const pos        = getPos(i);
              const isCenter   = pos === 0;
              const isAdjacent = Math.abs(pos) === 1;
              const isHidden   = Math.abs(pos) > 1;

              return (
                <div
                  key={item.step}
                  className={`hww-card
                    ${isCenter   ? "hww-center"   : ""}
                    ${isAdjacent ? "hww-adjacent" : ""}
                    ${isHidden   ? "hww-hidden"   : ""}
                    ${pos < 0    ? "hww-left"     : pos > 0 ? "hww-right" : ""}
                  `}
                  onClick={() => !isCenter && setActive(i)}
                  style={{ cursor: isCenter ? "default" : "pointer" }}
                >
                  <div className="hww-card-inner">
                    <div className="hww-top">
                      <span className="hww-step">{item.step}</span>
                      <span className="hww-icon">{item.icon}</span>
                    </div>
                    <h3 className="hww-title">{item.title}</h3>
                    <p className="hww-desc">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>

          <button className="hww-arrow hww-arrow-right" onClick={next} aria-label="Next">→</button>
        </div>

        <div className="hww-dots">
          {HOW_WE_WORK.map((_, i) => (
            <button
              key={i}
              className={`hww-dot ${i === active ? "hww-dot-active" : ""}`}
              onClick={() => setActive(i)}
              aria-label={`Go to step ${i + 1}`}
            />
          ))}
        </div>

        <p className="hww-swipe-hint">
          <span>←</span> swipe to navigate <span>→</span>
        </p>
      </section>
    </div>
  );
}