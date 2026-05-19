import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/auth.js";
import "./AdminLogin.css";

export default function AdminLogin({ toast }) {
  const [creds, setCreds]     = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate              = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = await login(creds.username, creds.password);

      if (data.success) {
        localStorage.setItem("karin_admin_token", data.token);
        toast?.success("Welcome back, " + data.admin.username + "!");
        navigate("/admin/dashboard");
      } else {
        toast?.error(data.message || "Invalid credentials.");
      }
    } catch {
      toast?.error("Cannot reach server. Check your connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="al-wrap">
      <div className="al-grid" />

      <div className="al-box">
        <div className="al-logo">
          <span className="al-k">K</span>
          <span className="al-rest">ARIN</span>
        </div>
        <div className="al-subtitle">Admin Portal</div>

        <form className="al-form" onSubmit={handleLogin}>
          <div className="al-group">
            <label className="al-label">Username</label>
            <input
              className="al-input"
              type="text"
              placeholder="kaushiki"
              required
              value={creds.username}
              onChange={(e) => setCreds((p) => ({ ...p, username: e.target.value }))}
            />
          </div>
          <div className="al-group">
            <label className="al-label">Password</label>
            <input
              className="al-input"
              type="password"
              placeholder="••••••••"
              required
              value={creds.password}
              onChange={(e) => setCreds((p) => ({ ...p, password: e.target.value }))}
            />
          </div>
          <button className="al-submit" type="submit" disabled={loading}>
            {loading ? "Signing in…" : "Sign In →"}
          </button>
        </form>

        <a href="/" className="al-back">← Back to site</a>
      </div>
    </div>
  );
}
