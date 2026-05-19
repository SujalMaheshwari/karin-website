import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import { getMessages, getMessageStats, markRead, deleteMessage } from "../services/contact.js";
import { getMe, logout } from "../services/auth.js";
import "./AdminDashboard.css";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ad-tooltip">
      <span className="ad-tooltip-label">{label}</span>
      <span className="ad-tooltip-val">{payload[0].value} msg</span>
    </div>
  );
};

export default function AdminDashboard() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("inbox");
  const navigate = useNavigate();

  const token = localStorage.getItem("karin_admin_token");

  useEffect(() => {
    if (!token) { navigate("/admin"); return; }
    getMe()
      .then((d) => setAdmin(d.admin))
      .catch(() => navigate("/admin"));
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([getMessages(1, 50), getMessageStats()])
      .then(([messagesRes, statsRes]) => {
        if (messagesRes.success) setMessages(messagesRes.data);
        if (statsRes.success) setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  const updateStatsForRead = (id) => {
    setStats((prev) => {
      if (!prev) return prev;
      const nextUnread = Math.max(0, prev.unread - 1);
      return {
        ...prev,
        unread: nextUnread,
        readRate: prev.total ? Math.round(((prev.total - nextUnread) / prev.total) * 100) : null,
        recent: prev.recent?.map((m) => m._id === id ? { ...m, isRead: true } : m) || [],
      };
    });
  };

  const handleMarkRead = async (id) => {
    const msg = messages.find((m) => m._id === id);
    await markRead(id);
    setMessages((prev) => prev.map((m) => m._id === id ? { ...m, isRead: true } : m));
    setSelected((prev) => prev?._id === id ? { ...prev, isRead: true } : prev);
    if (msg && !msg.isRead) updateStatsForRead(id);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this message?")) return;
    const deleted = messages.find((m) => m._id === id) || selected;
    await deleteMessage(id);
    setMessages((prev) => prev.filter((m) => m._id !== id));
    setStats((prev) => {
      if (!prev) return prev;
      const nextTotal = Math.max(0, prev.total - 1);
      const nextUnread = deleted && !deleted.isRead ? Math.max(0, prev.unread - 1) : prev.unread;
      return {
        ...prev,
        total: nextTotal,
        unread: nextUnread,
        readRate: nextTotal ? Math.round(((nextTotal - nextUnread) / nextTotal) * 100) : null,
        recent: prev.recent?.filter((m) => m._id !== id) || [],
      };
    });
    if (selected?._id === id) setSelected(null);
  };

  const handleOpen = (msg) => {
    setSelected(msg);
    if (!msg.isRead) handleMarkRead(msg._id);
  };

  const handleLogout = () => {
    logout();
    navigate("/admin");
  };

  const unread = stats?.unread ?? messages.filter((m) => !m.isRead).length;
  const total = stats?.total ?? messages.length;
  const thisWeek = stats?.thisWeek ?? 0;
  const readRate = stats?.readRate ?? (total ? Math.round(((total - unread) / total) * 100) : null);
  const weeklyData = stats?.weekly ?? [];
  const monthlyData = stats?.monthly ?? [];
  const recentMessages = stats?.recent ?? messages.slice(0, 8);
  const fmt = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });

  const ACCENT = getComputedStyle(document.documentElement).getPropertyValue("--accent").trim() || "#c8f564";

  return (
    <div className="ad-wrap">
      <header className="ad-header">
        <div className="ad-logo">
          <span className="ad-k">K</span>ARIN
          <span className="ad-badge">Admin</span>
        </div>
        <div className="ad-tabs">
          <button className={`ad-tab ${tab === "inbox" ? "active" : ""}`} onClick={() => setTab("inbox")}>
            Inbox {unread > 0 && <span className="ad-tab-badge">{unread}</span>}
          </button>
          <button className={`ad-tab ${tab === "charts" ? "active" : ""}`} onClick={() => setTab("charts")}>
            Analytics
          </button>
        </div>
        <div className="ad-header-right">
          {admin && <span className="ad-username">{admin.username}</span>}
          <a href="/" className="ad-site-link">View Site</a>
          <button className="ad-logout" onClick={handleLogout}>Log Out</button>
        </div>
      </header>

      {tab === "charts" && (
        <div className="ad-charts-page">
          <div className="ad-stat-cards">
            <div className="ad-stat-card">
              <div className="ad-stat-label">Total Leads</div>
              <div className="ad-stat-value">{total}</div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-label">Unread</div>
              <div className="ad-stat-value ad-stat-accent">{unread}</div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-label">This Week</div>
              <div className="ad-stat-value">{thisWeek}</div>
            </div>
            <div className="ad-stat-card">
              <div className="ad-stat-label">Read Rate</div>
              <div className="ad-stat-value">{readRate === null ? "-" : `${readRate}%`}</div>
            </div>
          </div>

          <div className="ad-charts-grid">
            <div className="ad-chart-card">
              <div className="ad-chart-title">Messages This Week</div>
              <div className="ad-chart-sub">Daily enquiry volume</div>
              <ResponsiveContainer width="100%" height={220}>
                <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorMsg" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={ACCENT} stopOpacity={0.25} />
                      <stop offset="95%" stopColor={ACCENT} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="day" tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="messages" stroke={ACCENT} strokeWidth={2} fill="url(#colorMsg)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>

            <div className="ad-chart-card">
              <div className="ad-chart-title">Monthly Overview</div>
              <div className="ad-chart-sub">Enquiries per month this year</div>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
                  <XAxis dataKey="month" tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <YAxis allowDecimals={false} tick={{ fontFamily: "DM Mono", fontSize: 10, fill: "var(--muted)" }} axisLine={false} tickLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="messages" fill={ACCENT} radius={[3, 3, 0, 0]} maxBarSize={40} fillOpacity={0.85} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="ad-table-card">
            <div className="ad-chart-title">Recent Enquiries</div>
            <table className="ad-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Preview</th>
                  <th>Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {recentMessages.map((m) => (
                  <tr key={m._id} onClick={() => { setTab("inbox"); setSelected(m); if (!m.isRead) handleMarkRead(m._id); }} className="ad-table-row">
                    <td className="ad-td-name">{m.name}</td>
                    <td className="ad-td-email">{m.email}</td>
                    <td className="ad-td-preview">{m.message.slice(0, 50)}...</td>
                    <td className="ad-td-date">{fmt(m.createdAt)}</td>
                    <td>
                      <span className={`ad-status-pill ${m.isRead ? "read" : "unread"}`}>
                        {m.isRead ? "Read" : "New"}
                      </span>
                    </td>
                  </tr>
                ))}
                {recentMessages.length === 0 && (
                  <tr><td colSpan={5} className="ad-td-empty">No messages yet</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {tab === "inbox" && (
        <div className="ad-body">
          <aside className="ad-sidebar">
            <div className="ad-sidebar-head">
              <span>Inbox</span>
              {unread > 0 && <span className="ad-unread-badge">{unread} new</span>}
            </div>
            {loading && <div className="ad-loading">Loading...</div>}
            {!loading && messages.length === 0 && <div className="ad-empty">No messages yet.</div>}
            {messages.map((msg) => (
              <div
                key={msg._id}
                className={`ad-msg-row ${!msg.isRead ? "unread" : ""} ${selected?._id === msg._id ? "active" : ""}`}
                onClick={() => handleOpen(msg)}
              >
                <div className="ad-msg-name">{msg.name}</div>
                <div className="ad-msg-preview">{msg.message.slice(0, 55)}{msg.message.length > 55 ? "..." : ""}</div>
                <div className="ad-msg-date">{fmt(msg.createdAt)}</div>
              </div>
            ))}
          </aside>

          <main className="ad-main">
            {!selected ? (
              <div className="ad-placeholder">
                <div className="ad-placeholder-icon">-</div>
                <p>Select a message to read it</p>
              </div>
            ) : (
              <div className="ad-detail">
                <div className="ad-detail-header">
                  <div>
                    <h2 className="ad-detail-name">{selected.name}</h2>
                    <a className="ad-detail-email" href={`mailto:${selected.email}`}>{selected.email}</a>
                  </div>
                  <div className="ad-detail-actions">
                    <a className="ad-reply-btn" href={`mailto:${selected.email}?subject=Re: Your enquiry - KARIN Pvt. Ltd.`}>
                      Reply
                    </a>
                    <button className="ad-delete-btn" onClick={() => handleDelete(selected._id)}>Delete</button>
                  </div>
                </div>
                <div className="ad-detail-meta">
                  <span>{fmt(selected.createdAt)}</span>
                  <span className={`ad-status ${selected.isRead ? "read" : "unread"}`}>
                    {selected.isRead ? "Read" : "New"}
                  </span>
                </div>
                <div className="ad-detail-body">{selected.message}</div>
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
}
