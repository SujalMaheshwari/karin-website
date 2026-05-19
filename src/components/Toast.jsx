import { useState, useEffect, useCallback } from "react";
import "./Toast.css";

/* ── Hook — use this in any component ── */
export function useToast() {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = "success", duration = 4000) => {
    const id = Date.now() + Math.random();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, duration);
  }, []);

  const toast = {
    success: (msg, dur)  => addToast(msg, "success", dur),
    error:   (msg, dur)  => addToast(msg, "error",   dur),
    info:    (msg, dur)  => addToast(msg, "info",    dur),
  };

  return { toasts, toast };
}

/* ── ToastContainer — place once in App or layout ── */
export function ToastContainer({ toasts, onRemove }) {
  return (
    <div className="toast-container">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onRemove={onRemove} />
      ))}
    </div>
  );
}

/* ── Single Toast ── */
function Toast({ toast, onRemove }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Trigger enter animation
    const t = setTimeout(() => setVisible(true), 10);
    return () => clearTimeout(t);
  }, []);

  const icons = {
    success: "✓",
    error:   "✗",
    info:    "◈",
  };

  return (
    <div
      className={`toast toast-${toast.type} ${visible ? "toast-visible" : ""}`}
      onClick={() => onRemove && onRemove(toast.id)}
    >
      <span className="toast-icon">{icons[toast.type]}</span>
      <span className="toast-message">{toast.message}</span>
    </div>
  );
}
