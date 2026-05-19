import { useState, useEffect, useRef } from "react";
import KarinLogo from "./KarinLogo.jsx";
import ThemeToggle from "./ThemeToggle.jsx";
import "./Navbar.css";

const NAV_LINKS = ["Services", "Work", "Process", "Team", "FAQ", "Contact"];
const SECTION_MAP = {
  Services: "services", Work: "work", Process: "process",
  Team: "team", FAQ: "faq", Contact: "contact",
};

export default function Navbar({ dark, setDark, scrollTo }) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [hidden,   setHidden]   = useState(false);
  const [active,   setActive]   = useState("");
  const [hovered,  setHovered]  = useState("");
  const lastY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      if (y > 120) setHidden(y > lastY.current);
      else setHidden(false);
      lastY.current = y;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const observers = [];
    Object.values(SECTION_MAP).forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const obs = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { threshold: 0.25 }
      );
      obs.observe(el);
      observers.push(obs);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const handleNav = (id) => { scrollTo(id); setMenuOpen(false); };

  return (
    <>
      <nav className={[scrolled ? "scrolled" : "", hidden ? "nav-hidden" : ""].join(" ").trim()}>
        {/* LOGO */}
        <div className="logo" onClick={() => scrollTo("hero")}>
          <KarinLogo size={44} showText={false} dark={dark} />
        </div>

        {/* LINKS */}
        <ul className="nav-links">
          {NAV_LINKS.map((l) => {
            const id = SECTION_MAP[l];
            return (
              <li key={l}>
                <a
                  href="#"
                  className={active === id ? "nav-active" : ""}
                  onMouseEnter={() => setHovered(id)}
                  onMouseLeave={() => setHovered("")}
                  onClick={(e) => { e.preventDefault(); handleNav(id); }}
                >
                  <span className="nav-label">{l}</span>
                  <span className={`nav-line ${active === id || hovered === id ? "nav-line-show" : ""}`} />
                </a>
              </li>
            );
          })}
        </ul>

        {/* RIGHT */}
        <div className="nav-right">
          <ThemeToggle dark={dark} setDark={setDark} />
          <button className="nav-cta" onClick={() => handleNav("contact")}>
            Start a Project →
          </button>
        </div>

        <button className={`hamburger${menuOpen ? " open" : ""}`}
          onClick={() => setMenuOpen(m => !m)} aria-label="Menu">
          <span /><span /><span />
        </button>
      </nav>

      {/* MOBILE MENU */}
      <div className={`mobile-menu${menuOpen ? " open" : ""}`}>
        <div className="mob-logo-wrap">
          <KarinLogo size={52} showText={false} dark={dark} />
        </div>
        <div className="mob-links">
          {NAV_LINKS.map((l, i) => (
            <a key={l} href="#"
              className={active === SECTION_MAP[l] ? "mob-active" : ""}
              onClick={(e) => { e.preventDefault(); handleNav(SECTION_MAP[l]); }}>
              <span className="mob-num">0{i + 1}</span>{l}
            </a>
          ))}
        </div>
        <div className="mob-bottom">
          <div className="mob-theme">
            <span>Switch theme</span>
            <ThemeToggle dark={dark} setDark={setDark} />
          </div>
          <button className="btn-primary mob-cta"
            onClick={() => handleNav("contact")} style={{ cursor: "pointer" }}>
            Start a Project →
          </button>
        </div>
      </div>
    </>
  );
}
