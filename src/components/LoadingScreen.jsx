import { useEffect, useState } from "react";
import KarinLogo from "./KarinLogo.jsx";
import "./LoadingScreen.css";

export default function LoadingScreen({ onDone }) {
  const [phase,    setPhase]    = useState("enter");
  const [progress, setProgress] = useState(0);
  const [dark,     setDark]     = useState(true);

  useEffect(() => {
    setDark(document.body.classList.contains("dark"));
  }, []);

  useEffect(() => {
    let val = 0;
    const step = () => {
      val += Math.random() * 14 + 4;
      if (val >= 100) {
        setProgress(100);
        setTimeout(() => setPhase("exit"), 300);
        return;
      }
      setProgress(Math.min(val, 100));
      setTimeout(step, 80);
    };
    const t = setTimeout(step, 200);
    return () => clearTimeout(t);
  }, []);

  const handleAnimEnd = (e) => {
    if (phase === "exit" && e.animationName === "ls-fade-out") onDone();
  };

  return (
    <div
      className={`ls-wrap ${phase === "exit" ? "ls-exit" : ""}`}
      onAnimationEnd={handleAnimEnd}
    >
      <div className="ls-grid" />

      <div className="ls-center">
        {/* Real KA monogram */}
        <div className="ls-logo-wrap">
          <KarinLogo size={80} showText={false} dark={dark} />
        </div>

        {/* Wordmark */}
        <div className="ls-wordmark">
          <span className="ls-karin">KARIN</span>
          <span className="ls-ai">AI</span>
        </div>

        <div className="ls-tagline">Turning Ideas Into Products</div>

        {/* Progress bar */}
        <div className="ls-bar-track">
          <div className="ls-bar-fill" style={{ width: `${progress}%` }} />
        </div>

        <div className="ls-percent">
          {Math.round(progress)}<span>%</span>
        </div>
      </div>

      <div className="ls-corner">Bhopal · India · 2025</div>
    </div>
  );
}
