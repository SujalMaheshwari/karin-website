import { STATS } from "../data/index.js";
import Reveal from "./Reveal.jsx";
import "./Stats.css";

export default function Stats() {
  return (
    <div className="stats-wrap">
      <div className="stats-inner">
        {STATS.map((s, i) => (
          <Reveal key={s.label} delay={i * 0.08} style={{ display: "contents" }}>
            <div className="stat-item">
              <div className="stat-val">{s.value}</div>
              <div className="stat-lbl">{s.label}</div>
            </div>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
