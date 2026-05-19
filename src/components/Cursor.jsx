import { useEffect, useRef } from "react";

/**
 * Cursor — custom dot + lagging ring cursor.
 * Dot snaps instantly; ring lerps behind.
 * Ring scales up on hover over links/buttons.
 * Hidden on mobile (≤768px).
 */
export default function Cursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);

  /* Animate dot (instant) and ring (lerp) */
  useEffect(() => {
    let dotX = 0, dotY = 0, ringX = 0, ringY = 0;
    let raf;

    const onMove = (e) => {
      dotX = e.clientX;
      dotY = e.clientY;
    };

    window.addEventListener("mousemove", onMove);

    const tick = () => {
      ringX += (dotX - ringX) * 0.13;
      ringY += (dotY - ringY) * 0.13;

      if (dotRef.current) {
        dotRef.current.style.left = dotX + "px";
        dotRef.current.style.top  = dotY + "px";
      }
      if (ringRef.current) {
        ringRef.current.style.left = ringX + "px";
        ringRef.current.style.top  = ringY + "px";
      }
      raf = requestAnimationFrame(tick);
    };

    raf = requestAnimationFrame(tick);
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  /* Scale ring on interactive elements */
  useEffect(() => {
    const grow   = () => { if (ringRef.current) ringRef.current.style.transform = "translate(-50%,-50%) scale(1.7)"; };
    const shrink = () => { if (ringRef.current) ringRef.current.style.transform = "translate(-50%,-50%) scale(1)";   };

    const attach = () => {
      const els = document.querySelectorAll("a, button, [data-hover]");
      els.forEach(el => {
        el.addEventListener("mouseenter", grow);
        el.addEventListener("mouseleave", shrink);
      });
      return els;
    };

    // Run immediately and re-run after a short delay to catch dynamic elements
    let els = attach();
    const t = setTimeout(() => { els = attach(); }, 500);

    return () => {
      clearTimeout(t);
      els.forEach(el => {
        el.removeEventListener("mouseenter", grow);
        el.removeEventListener("mouseleave", shrink);
      });
    };
  });

  return (
    <>
      <div ref={dotRef}  className="cursor-dot"  />
      <div ref={ringRef} className="cursor-ring" />
    </>
  );
}
