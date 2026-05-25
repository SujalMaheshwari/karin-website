import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  AreaChart, Area, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer
} from "recharts";
import { getMessages, getMessageStats, markRead, deleteMessage } from "../services/contact.js";
import { getMe, logout } from "../services/auth.js";
import { createCmsItem, deleteCmsItem, getCmsResource, updateCmsItem } from "../services/cms.js";
import { FALLBACK_CONTENT, normalizeContent } from "../hooks/useSiteContent.js";
import "./AdminDashboard.css";

const CMS_RESOURCES = ["services", "projects", "team"];

const RESOURCE_LABELS = {
  services: "Services",
  projects: "Projects",
  team: "Team",
};

const emptyForms = {
  services: {
    title: "",
    icon: "AI",
    desc: "",
    tags: "",
    order: 0,
    visible: true,
  },
  projects: {
    title: "",
    slug: "",
    category: "",
    year: new Date().getFullYear().toString(),
    type: "",
    desc: "",
    tags: "",
    color: "#c8f564",
    image: "",
    imageAlt: "",
    videoUrl: "",
    duration: "",
    summary: "",
    problem: "",
    goals: "",
    approach: "",
    challenges: "",
    outcomes: "",
    order: 0,
    visible: true,
  },
  team: {
    name: "",
    role: "",
    bio: "",
    initial: "",
    image: "",
    order: 0,
    visible: true,
  },
};

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="ad-tooltip">
      <span className="ad-tooltip-label">{label}</span>
      <span className="ad-tooltip-val">{payload[0].value} msg</span>
    </div>
  );
};

const splitComma = (value) =>
  String(value || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const splitLines = (value) =>
  String(value || "")
    .split(/\r?\n/)
    .map((item) => item.trim())
    .filter(Boolean);

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

const fileToDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

const toForm = (resource, item = {}) => {
  const base = { ...emptyForms[resource] };

  if (resource === "services") {
    return {
      ...base,
      ...item,
      tags: (item.tags || []).join(", "),
      visible: item.visible !== false,
    };
  }

  if (resource === "projects") {
    return {
      ...base,
      ...item,
      slug: item.slug || item.id || "",
      tags: (item.tags || item.stack || []).join(", "),
      goals: (item.goals || []).join("\n"),
      outcomes: (item.outcomes || []).join("\n"),
      visible: item.visible !== false,
    };
  }

  return {
    ...base,
    ...item,
    visible: item.visible !== false,
  };
};

const serializeForm = (resource, form) => {
  if (resource === "services") {
    return {
      ...form,
      tags: splitComma(form.tags),
      order: Number(form.order || 0),
      visible: Boolean(form.visible),
    };
  }

  if (resource === "projects") {
    return {
      ...form,
      slug: form.slug || slugify(form.title),
      tags: splitComma(form.tags),
      goals: splitLines(form.goals),
      outcomes: splitLines(form.outcomes),
      order: Number(form.order || 0),
      visible: Boolean(form.visible),
    };
  }

  return {
    ...form,
    order: Number(form.order || 0),
    visible: Boolean(form.visible),
  };
};

export default function AdminDashboard({ toast }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [stats, setStats] = useState(null);
  const [tab, setTab] = useState("inbox");
  const [cms, setCms] = useState(FALLBACK_CONTENT);
  const [cmsLoading, setCmsLoading] = useState(false);
  const [cmsSaving, setCmsSaving] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForms.services);
  const navigate = useNavigate();

  const token = localStorage.getItem("karin_admin_token");
  const activeResource = CMS_RESOURCES.includes(tab) ? tab : null;

  const notify = (message, type = "success") => {
    if (toast?.[type]) toast[type](message);
    else if (typeof toast === "function") toast(message, type);
  };

  const loadCms = async () => {
    setCmsLoading(true);
    try {
      const [servicesRes, projectsRes, teamRes] = await Promise.all([
        getCmsResource("services"),
        getCmsResource("projects"),
        getCmsResource("team"),
      ]);

      setCms(normalizeContent({
        services: servicesRes.data,
        projects: projectsRes.data,
        team: teamRes.data,
      }));
    } catch (err) {
      setCms(FALLBACK_CONTENT);
      notify("CMS is showing fallback content until the database is connected.", "error");
    } finally {
      setCmsLoading(false);
    }
  };

  useEffect(() => {
    if (!token) { navigate("/admin"); return; }
    getMe()
      .then((d) => setAdmin(d.admin))
      .catch(() => navigate("/admin"));
  }, []);

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    Promise.all([getMessages(1, 50), getMessageStats(), loadCms()])
      .then(([messagesRes, statsRes]) => {
        if (messagesRes.success) setMessages(messagesRes.data);
        if (statsRes.success) setStats(statsRes.data);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!activeResource) return;
    setEditingId(null);
    setForm(emptyForms[activeResource]);
  }, [activeResource]);

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

  const updateForm = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleMediaUpload = async (event, field) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 12 * 1024 * 1024) {
      notify("Please use an external URL for media larger than 12 MB.", "error");
      event.target.value = "";
      return;
    }

    try {
      const dataUrl = await fileToDataUrl(file);
      updateForm(field, dataUrl);
      if (field === "image" && !form.imageAlt) updateForm("imageAlt", file.name);
    } catch {
      notify("Could not read this file.", "error");
    }
  };

  const startEdit = (resource, item) => {
    setEditingId(item._id || null);
    setForm(toForm(resource, item));
    setTab(resource);
  };

  const startNew = (resource) => {
    setEditingId(null);
    setForm(emptyForms[resource]);
  };

  const saveCmsItem = async (event) => {
    event.preventDefault();
    if (!activeResource) return;

    setCmsSaving(true);
    try {
      const payload = serializeForm(activeResource, form);
      if (editingId) {
        await updateCmsItem(activeResource, editingId, payload);
      } else {
        await createCmsItem(activeResource, payload);
      }
      notify(`${RESOURCE_LABELS[activeResource]} updated.`);
      await loadCms();
      startNew(activeResource);
    } catch (err) {
      notify(err.message || "Could not save CMS item.", "error");
    } finally {
      setCmsSaving(false);
    }
  };

  const removeCmsItem = async (resource, item) => {
    if (!item._id) {
      notify("Save fallback content to the CMS before deleting it.", "error");
      return;
    }
    if (!confirm(`Delete ${item.title || item.name}?`)) return;

    try {
      await deleteCmsItem(resource, item._id);
      notify(`${RESOURCE_LABELS[resource]} item deleted.`);
      await loadCms();
      if (editingId === item._id) startNew(resource);
    } catch (err) {
      notify(err.message || "Could not delete CMS item.", "error");
    }
  };

  const unread = stats?.unread ?? messages.filter((m) => !m.isRead).length;
  const total = stats?.total ?? messages.length;
  const thisWeek = stats?.thisWeek ?? 0;
  const readRate = stats?.readRate ?? (total ? Math.round(((total - unread) / total) * 100) : null);
  const weeklyData = stats?.weekly ?? [];
  const monthlyData = stats?.monthly ?? [];
  const recentMessages = stats?.recent ?? messages.slice(0, 8);
  const fmt = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
  const ACCENT = getComputedStyle(document.body).getPropertyValue("--accent").trim() || "#c8f564";

  const cmsItems = useMemo(() => {
    if (!activeResource) return [];
    return cms[activeResource] || [];
  }, [activeResource, cms]);

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
          {CMS_RESOURCES.map((resource) => (
            <button
              className={`ad-tab ${tab === resource ? "active" : ""}`}
              key={resource}
              onClick={() => setTab(resource)}
            >
              {RESOURCE_LABELS[resource]}
            </button>
          ))}
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

      {activeResource && (
        <div className="ad-cms-page">
          <aside className="ad-cms-list">
            <div className="ad-cms-list-head">
              <div>
                <span className="ad-cms-kicker">Website CMS</span>
                <h2>{RESOURCE_LABELS[activeResource]}</h2>
              </div>
              <button className="ad-cms-new" onClick={() => startNew(activeResource)}>New</button>
            </div>

            {cmsLoading && (
              <div className="ad-skeleton-stack">
                <span />
                <span />
                <span />
              </div>
            )}

            {!cmsLoading && cmsItems.map((item) => (
              <article className="ad-cms-item" key={item._id || item.slug || item.id || item.title || item.name}>
                <div>
                  <h3>{item.title || item.name}</h3>
                  <p>{item.desc || item.bio || item.role}</p>
                  {!item._id && <span className="ad-fallback-pill">Fallback</span>}
                  {item.visible === false && <span className="ad-fallback-pill muted">Hidden</span>}
                </div>
                <div className="ad-cms-item-actions">
                  <button onClick={() => startEdit(activeResource, item)}>Edit</button>
                  <button className="danger" onClick={() => removeCmsItem(activeResource, item)}>Delete</button>
                </div>
              </article>
            ))}
          </aside>

          <main className="ad-cms-editor">
            <form onSubmit={saveCmsItem} className="ad-cms-form">
              <div className="ad-cms-form-head">
                <div>
                  <span className="ad-cms-kicker">{editingId ? "Editing" : "Create"}</span>
                  <h2>{RESOURCE_LABELS[activeResource]} Item</h2>
                </div>
                <label className="ad-toggle">
                  <input
                    type="checkbox"
                    checked={form.visible}
                    onChange={(event) => updateForm("visible", event.target.checked)}
                  />
                  Visible
                </label>
              </div>

              {activeResource === "services" && (
                <div className="ad-form-grid">
                  <label>
                    Title
                    <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} required />
                  </label>
                  <label>
                    Icon / Label
                    <input value={form.icon} onChange={(event) => updateForm("icon", event.target.value)} />
                  </label>
                  <label className="span-2">
                    Description
                    <textarea value={form.desc} onChange={(event) => updateForm("desc", event.target.value)} required rows={5} />
                  </label>
                  <label>
                    Tech Tags
                    <input value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} placeholder="React, Node.js, AI/ML" />
                  </label>
                  <label>
                    Display Order
                    <input type="number" value={form.order} onChange={(event) => updateForm("order", event.target.value)} />
                  </label>
                </div>
              )}

              {activeResource === "projects" && (
                <div className="ad-form-grid">
                  <label>
                    Project Title
                    <input value={form.title} onChange={(event) => updateForm("title", event.target.value)} required />
                  </label>
                  <label>
                    URL Slug
                    <input value={form.slug} onChange={(event) => updateForm("slug", event.target.value)} placeholder={slugify(form.title)} />
                  </label>
                  <label>
                    Category
                    <input value={form.category} onChange={(event) => updateForm("category", event.target.value)} placeholder="Full-Stack / AI" />
                  </label>
                  <label>
                    Year
                    <input value={form.year} onChange={(event) => updateForm("year", event.target.value)} />
                  </label>
                  <label>
                    Project Type
                    <input value={form.type} onChange={(event) => updateForm("type", event.target.value)} placeholder="Client Build" />
                  </label>
                  <label>
                    Accent Color
                    <input type="color" value={form.color} onChange={(event) => updateForm("color", event.target.value)} />
                  </label>
                  <label className="span-2">
                    Short Description
                    <textarea value={form.desc} onChange={(event) => updateForm("desc", event.target.value)} required rows={4} />
                  </label>
                  <label>
                    Tech Stack Tags
                    <input value={form.tags} onChange={(event) => updateForm("tags", event.target.value)} placeholder="React, Next.js, Python" />
                  </label>
                  <label>
                    Duration
                    <input value={form.duration} onChange={(event) => updateForm("duration", event.target.value)} placeholder="6 weeks" />
                  </label>
                  <label className="span-2">
                    Image URL
                    <input value={form.image} onChange={(event) => updateForm("image", event.target.value)} placeholder="https://..." />
                  </label>
                  <label>
                    Upload Image
                    <input type="file" accept="image/*" onChange={(event) => handleMediaUpload(event, "image")} />
                  </label>
                  <label>
                    Image Alt Text
                    <input value={form.imageAlt} onChange={(event) => updateForm("imageAlt", event.target.value)} />
                  </label>
                  <label className="span-2">
                    Demo Video URL
                    <input value={form.videoUrl} onChange={(event) => updateForm("videoUrl", event.target.value)} placeholder="YouTube, Vimeo, MP4, or uploaded data URL" />
                  </label>
                  <label className="span-2">
                    Upload Demo Video
                    <input type="file" accept="video/*" onChange={(event) => handleMediaUpload(event, "videoUrl")} />
                  </label>
                  <label className="span-2">
                    Case Study Summary
                    <textarea value={form.summary} onChange={(event) => updateForm("summary", event.target.value)} rows={3} />
                  </label>
                  <label className="span-2">
                    Problem
                    <textarea value={form.problem} onChange={(event) => updateForm("problem", event.target.value)} rows={4} />
                  </label>
                  <label className="span-2">
                    Goals
                    <textarea value={form.goals} onChange={(event) => updateForm("goals", event.target.value)} rows={4} placeholder="One goal per line" />
                  </label>
                  <label className="span-2">
                    Approach
                    <textarea value={form.approach} onChange={(event) => updateForm("approach", event.target.value)} rows={4} />
                  </label>
                  <label className="span-2">
                    Challenges
                    <textarea value={form.challenges} onChange={(event) => updateForm("challenges", event.target.value)} rows={4} />
                  </label>
                  <label className="span-2">
                    Outcomes
                    <textarea value={form.outcomes} onChange={(event) => updateForm("outcomes", event.target.value)} rows={4} placeholder="One outcome per line" />
                  </label>
                  <label>
                    Display Order
                    <input type="number" value={form.order} onChange={(event) => updateForm("order", event.target.value)} />
                  </label>
                </div>
              )}

              {activeResource === "team" && (
                <div className="ad-form-grid">
                  <label>
                    Name
                    <input value={form.name} onChange={(event) => updateForm("name", event.target.value)} required />
                  </label>
                  <label>
                    Initials
                    <input value={form.initial} onChange={(event) => updateForm("initial", event.target.value)} />
                  </label>
                  <label className="span-2">
                    Role
                    <input value={form.role} onChange={(event) => updateForm("role", event.target.value)} required />
                  </label>
                  <label className="span-2">
                    Bio
                    <textarea value={form.bio} onChange={(event) => updateForm("bio", event.target.value)} required rows={5} />
                  </label>
                  <label className="span-2">
                    Profile Image URL
                    <input value={form.image} onChange={(event) => updateForm("image", event.target.value)} placeholder="https://..." />
                  </label>
                  <label>
                    Upload Image
                    <input type="file" accept="image/*" onChange={(event) => handleMediaUpload(event, "image")} />
                  </label>
                  <label>
                    Display Order
                    <input type="number" value={form.order} onChange={(event) => updateForm("order", event.target.value)} />
                  </label>
                </div>
              )}

              <div className="ad-cms-actions">
                <button type="button" className="ad-cancel-btn" onClick={() => startNew(activeResource)}>Reset</button>
                <button type="submit" className="ad-save-btn" disabled={cmsSaving}>
                  {cmsSaving ? "Saving..." : editingId ? "Save Changes" : "Create Item"}
                </button>
              </div>
            </form>
          </main>
        </div>
      )}
    </div>
  );
}
