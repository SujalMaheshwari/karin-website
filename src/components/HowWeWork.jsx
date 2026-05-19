import { useRef, useState } from "react";
import { HOW_WE_WORK } from "../data/index.js";
import Reveal from "./Reveal.jsx";
import "./HowWeWork.css";

export default function HowWeWork() {
  const [active, setActive] = useState(0);
  const swipeStart = useRef(null);
  const total = HOW_WE_WORK.length;

  const prev = () => setActive((a) => (a - 1 + total) % total);
  const next = () => setActive((a) => (a + 1) % total);

  const handlePointerDown = (event) => {
    if (event.pointerType === "mouse" && event.button !== 0) return;

    swipeStart.current = {
      x: event.clientX,
      y: event.clientY,
    };

    event.currentTarget.setPointerCapture?.(event.pointerId);
  };

  const handlePointerUp = (event) => {
    if (!swipeStart.current) return;

    const deltaX = event.clientX - swipeStart.current.x;
    const deltaY = event.clientY - swipeStart.current.y;

    swipeStart.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);

    if (Math.abs(deltaX) < 45 || Math.abs(deltaX) < Math.abs(deltaY) * 1.2) {
      return;
    }

    if (deltaX < 0) next();
    else prev();
  };

  const handlePointerCancel = (event) => {
    swipeStart.current = null;
    event.currentTarget.releasePointerCapture?.(event.pointerId);
  };

  /* Determine position relative to active */
  const getPos = (i) => {
    let diff = i - active;
    if (diff < -(total / 2)) diff += total;
    if (diff > total / 2)  diff -= total;
    return diff; // -2, -1, 0, 1, 2
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
          {/* Left arrow */}
          <button className="hww-arrow hww-arrow-left" onClick={prev} aria-label="Previous">
            ←
          </button>

          {/* Track */}
          <div
            className="hww-track"
            onPointerDown={handlePointerDown}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerCancel}
          >
            {HOW_WE_WORK.map((item, i) => {
              const pos = getPos(i);
              const isCenter = pos === 0;
              const isAdjacent = Math.abs(pos) === 1;
              const isHidden = Math.abs(pos) > 1;

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

          {/* Right arrow */}
          <button className="hww-arrow hww-arrow-right" onClick={next} aria-label="Next">
            →
          </button>
        </div>

        {/* Dot indicators */}
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
      </section>
    </div>
  );
}
