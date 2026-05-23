import { useState, useRef, useCallback } from "react";
import { HOW_WE_WORK } from "../data/index.js";
import Reveal from "./Reveal.jsx";
import "./HowWeWork.css";

export default function HowWeWork() {
  const [active, setActive]   = useState(0);
  const [drag,   setDrag]     = useState(0);    // live drag offset px
  const [isDragging, setIsDragging] = useState(false);
  const total     = HOW_WE_WORK.length;
  const startX    = useRef(null);
  const startDot  = useRef(null); // for dot-strip drag
  const dotRef    = useRef(null);

  /* ── Helpers ── */
  const prev = () => setActive(a => (a - 1 + total) % total);
  const next = () => setActive(a => (a + 1) % total);

  const commitDrag = useCallback((deltaX) => {
    if (Math.abs(deltaX) > 36) deltaX > 0 ? prev() : next();
    setDrag(0);
    setIsDragging(false);
  }, [active]);

  /* ── Card touch / mouse drag ── */
  const onPointerDown = (e) => {
    startX.current = e.clientX ?? e.touches?.[0]?.clientX;
    setIsDragging(true);
  };

  const onPointerMove = (e) => {
    if (!isDragging || startX.current === null) return;
    const x = e.clientX ?? e.touches?.[0]?.clientX;
    setDrag(x - startX.current);
  };

  const onPointerUp = (e) => {
    if (!isDragging) return;
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
    commitDrag(x - startX.current);
    startX.current = null;
  };

  /* ── Dot-strip drag ── */
  const onDotPointerDown = (e) => {
    startDot.current = e.clientX ?? e.touches?.[0]?.clientX;
  };

  const onDotPointerUp = (e) => {
    if (startDot.current === null) return;
    const x = e.clientX ?? e.changedTouches?.[0]?.clientX;
    const delta = (startDot.current - x);
    if (Math.abs(delta) > 20) delta > 0 ? next() : prev();
    startDot.current = null;
  };

  /* ── Desktop carousel positions ── */
  const getPos = (i) => {
    let diff = i - active;
    if (diff < -(total / 2)) diff += total;
    if (diff > total / 2)    diff -= total;
    return diff;
  };

  const swipeHint = "← swipe to navigate →";

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
              A clear, structured process that keeps you
              informed and in control at every stage.
            </p>
          </div>
        </Reveal>

        {/* ════ DESKTOP CAROUSEL ════ */}
        <div className="hww-carousel-wrap">
          <button className="hww-arrow hww-arrow-left"  onClick={prev} aria-label="Previous">←</button>

          <div className="hww-track">
            {HOW_WE_WORK.map((item, i) => {
              const pos        = getPos(i);
              const isCenter   = pos === 0;
              const isAdjacent = Math.abs(pos) === 1;
              const isHidden   = Math.abs(pos) > 1;
              return (
                <div key={item.step}
                  className={["hww-card",
                    isCenter   ? "hww-center"  : "",
                    isAdjacent ? "hww-adjacent": "",
                    isHidden   ? "hww-hidden"  : "",
                    pos < 0    ? "hww-left"    : pos > 0 ? "hww-right" : "",
                  ].join(" ").trim()}
                  onClick={() => !isCenter && setActive(i)}
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

        {/* Desktop dots */}
        <div className="hww-dots hww-dots-desktop">
          {HOW_WE_WORK.map((_, i) => (
            <button key={i}
              className={`hww-dot ${i === active ? "hww-dot-active" : ""}`}
              onClick={() => setActive(i)} />
          ))}
        </div>

        {/* ════ MOBILE SLIDER ════ */}
        <div className="hww-mobile">
          {/* Viewport — shows center + peeks of sides */}
          <div className="hww-mob-viewport"
            onMouseDown={onPointerDown}
            onMouseMove={onPointerMove}
            onMouseUp={onPointerUp}
            onMouseLeave={onPointerUp}
            onTouchStart={(e) => onPointerDown({ clientX: e.touches[0].clientX })}
            onTouchMove={(e) => { e.preventDefault(); onPointerMove({ clientX: e.touches[0].clientX }); }}
            onTouchEnd={(e) => onPointerUp({ clientX: e.changedTouches[0].clientX })}
            style={{ touchAction: "pan-y" }}
          >
            <div
              className="hww-mob-track"
              style={{
                transform: `translateX(calc(-${active * 100}% + ${drag}px))`,
                transition: isDragging ? "none" : "transform 0.42s cubic-bezier(0.22,1,0.36,1)",
              }}
            >
              {HOW_WE_WORK.map((item, i) => (
                <div
                  key={item.step}
                  className={`hww-mob-card ${i === active ? "hww-mob-active" : ""}`}
                >
                  <div className="hww-top">
                    <span className="hww-step">{item.step}</span>
                    <span className="hww-icon">{item.icon}</span>
                  </div>
                  <h3 className="hww-title">{item.title}</h3>
                  <p className="hww-desc">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Dot strip — also draggable */}
          <div className="hww-mob-bottom">
            <div
              ref={dotRef}
              className="hww-dots hww-mob-dots"
              onMouseDown={onDotPointerDown}
              onMouseUp={onDotPointerUp}
              onTouchStart={(e) => onDotPointerDown({ clientX: e.touches[0].clientX })}
              onTouchEnd={(e) => onDotPointerUp({ clientX: e.changedTouches[0].clientX })}
            >
              {HOW_WE_WORK.map((_, i) => (
                <button key={i}
                  className={`hww-dot ${i === active ? "hww-dot-active" : ""}`}
                  onClick={() => setActive(i)} />
              ))}
            </div>
            <span className="hww-swipe-hint">{swipeHint}</span>
          </div>
        </div>

      </section>
    </div>
  );
}