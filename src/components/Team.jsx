import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import "./Team.css";

const STUDIO_STATS = [
  { value: "3", label: "Engineers" },
  { value: "4+", label: "Products Built" },
  { value: "2025", label: "Founded" },
  { value: "24/7", label: "Build Energy" },
];

const initialsFor = (member) =>
  member.initial || String(member.name || "KA").split(" ").map((part) => part[0]).join("").slice(0, 3);

function MemberAvatar({ member, large = false }) {
  if (member.image) {
    return (
      <img
        className={large ? "team-avatar large" : "team-avatar"}
        src={member.image}
        alt={member.name}
        loading="lazy"
      />
    );
  }

  return (
    <div className={large ? "team-avatar large" : "team-avatar"}>
      {initialsFor(member)}
    </div>
  );
}

export default function Team({ team = [] }) {
  const reduceMotion = useReducedMotion();
  const director = team[0];
  const members = team.slice(1);

  return (
    <div className="team-bg">
      <section id="team" className="team-section">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">The Studio</div>
              <h2 className="sec-title">Built by <em>Engineers</em></h2>
            </div>
            <p className="team-tagline">
              Small team. Sharp focus.<br />No fluff, just craft.
            </p>
          </div>
        </Reveal>

        <div className="team-layout">
          {director && (
            <Reveal delay={0.05}>
              <motion.article
                className="team-director-card"
                whileHover={reduceMotion ? undefined : { y: -8 }}
                transition={{ duration: 0.25 }}
              >
                <span className="team-card-light" />
                <MemberAvatar member={director} large />
                <div className="team-director-info">
                  <div className="team-director-label">{director.role}</div>
                  <h3 className="team-director-name">{director.name}</h3>
                  <p className="team-director-bio">{director.bio}</p>
                </div>
              </motion.article>
            </Reveal>
          )}

          <div className="team-right">
            <Reveal delay={0.1}>
              <div className="team-studio-label">Studio at a glance</div>
            </Reveal>

            <div className="team-stats-grid">
              {STUDIO_STATS.map((stat, index) => (
                <Reveal key={stat.label} delay={0.12 + index * 0.07}>
                  <div className="team-stat">
                    <span className="team-stat-val">{stat.value}</span>
                    <span className="team-stat-lbl">{stat.label}</span>
                  </div>
                </Reveal>
              ))}
            </div>

            {members.length > 0 && (
              <div className="team-members-grid">
                {members.map((member, index) => (
                  <motion.article
                    className="team-member-card"
                    key={member._id || member.name}
                    initial={reduceMotion ? false : { opacity: 0, y: 20 }}
                    whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.5, delay: index * 0.06 }}
                    whileHover={reduceMotion ? undefined : { y: -6 }}
                  >
                    <span className="team-card-light" />
                    <MemberAvatar member={member} />
                    <div>
                      <h3 className="team-member-name">{member.name}</h3>
                      <span className="team-member-role">{member.role}</span>
                    </div>
                    <p className="team-member-bio">{member.bio}</p>
                  </motion.article>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
