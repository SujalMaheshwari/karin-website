import "./NotFound.css";

export default function NotFound({ scrollTo }) {
  return (
    <div className="nf-wrap">
      <div className="nf-inner">
        <div className="nf-code">404</div>
        <h1 className="nf-title">Page Not Found</h1>
        <p className="nf-sub">
          This page doesn't exist — but our work does.
          Let's get you back on track.
        </p>
        <div className="nf-btns">
          <a href="/" className="btn-primary">← Back to Home</a>
          <a
            href="#"
            className="btn-ghost"
            onClick={(e) => { e.preventDefault(); window.location.href = "/#contact"; }}
          >
            Start a Project
          </a>
        </div>
      </div>
    </div>
  );
}
