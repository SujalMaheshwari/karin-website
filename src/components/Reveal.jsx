import { useReveal } from "../hooks/useReveal";

/**
 * Reveal — wraps children in a fade-up scroll animation.
 * Props:
 *   delay    (number) — animation delay in seconds
 *   className (string)
 *   style    (object)
 */
export default function Reveal({ children, delay = 0, className = "", style = {} }) {
  const [ref, visible] = useReveal();

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.72s ${delay}s cubic-bezier(0.22,1,0.36,1),
                     transform 0.72s ${delay}s cubic-bezier(0.22,1,0.36,1)`,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
