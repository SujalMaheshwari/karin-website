import KarinLogo from "./KarinLogo.jsx";
import "./Footer.css";

export default function Footer({ dark = true }) {
  return (
    <footer>
      <div className="footer-inner">
        <div>
          <div className="footer-logo-wrap">
            <KarinLogo size={32} showText dark={dark} />
          </div>
          <div className="footer-copy">
            © 2025 KARIN Pvt. Ltd. · Bhopal, India · All rights reserved.
          </div>
        </div>
        <div className="footer-links">
          <a href="#" target="_blank" rel="noreferrer">LinkedIn</a>
          <a href="#" target="_blank" rel="noreferrer">GitHub</a>
          <a href="#" target="_blank" rel="noreferrer">Twitter</a>
        </div>
      </div>
    </footer>
  );
}
