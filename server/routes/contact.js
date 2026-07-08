import express from "express";
import nodemailer from "nodemailer";
import rateLimit from "express-rate-limit";
import dns from "node:dns/promises";
import net from "node:net";
import Message from "../models/Message.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();
const REQUIRED_EMAIL_ENV = ["SMTP_HOST", "SMTP_PORT", "SMTP_USER", "SMTP_PASS", "CONTACT_RECEIVER"];

const escapeHtml = (value = "") =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");

const stripHeaderBreaks = (value = "") =>
  String(value).replace(/[\r\n]+/g, " ").trim();

const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: { success: false, message: "Too many requests. Please try again in 15 minutes." },
});

const parseSmtpPort = () => {
  const port = Number(process.env.SMTP_PORT);
  if (!Number.isInteger(port) || port <= 0 || port > 65535) {
    throw new Error("SMTP_PORT must be a valid port number.");
  }
  return port;
};

const resolveSmtpHost = async (host) => {
  if (process.env.SMTP_FORCE_IPV4 === "false" || net.isIP(host)) {
    return { host };
  }

  try {
    const [ipv4Address] = await dns.resolve4(host);
    if (ipv4Address) {
      return {
        host: ipv4Address,
        servername: host,
      };
    }
  } catch (err) {
    console.warn(`SMTP IPv4 lookup failed for ${host}; falling back to configured host:`, err.message);
  }

  return { host };
};

const createTransporter = async () => {
  const missing = REQUIRED_EMAIL_ENV.filter((key) => !process.env[key]?.trim());
  if (missing.length) {
    throw new Error(`Email service is missing required configuration: ${missing.join(", ")}.`);
  }

  const smtpHost = process.env.SMTP_HOST.trim();
  const smtpPort = parseSmtpPort();
  const hostOptions = await resolveSmtpHost(smtpHost);

  return nodemailer.createTransport({
    ...hostOptions,
    port: smtpPort,
    secure: smtpPort === 465,
    requireTLS: smtpPort === 587,
    connectionTimeout: 15000,
    greetingTimeout: 15000,
    socketTimeout: 30000,
    tls: hostOptions.servername ? { servername: hostOptions.servername } : undefined,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

router.post("/", contactLimiter, async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const cleanName = stripHeaderBreaks(name);
    const cleanEmail = stripHeaderBreaks(email).toLowerCase();
    const cleanMessage = String(message || "").trim();

    if (!cleanName || !cleanEmail || !cleanMessage) {
      return res.status(400).json({ success: false, message: "All fields are required." });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return res.status(400).json({ success: false, message: "Invalid email address." });
    }
    if (cleanMessage.length < 10) {
      return res.status(400).json({ success: false, message: "Message is too short." });
    }

    const safeName = escapeHtml(cleanName);
    const safeEmail = escapeHtml(cleanEmail);
    const safeMessage = escapeHtml(cleanMessage).replace(/\n/g, "<br>");

    const saved = await Message.create({
      name: cleanName,
      email: cleanEmail,
      message: cleanMessage,
      ipAddress: req.ip,
    });

    const transporter = await createTransporter();
    await transporter.sendMail({
      from: `"KARIN Website" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_RECEIVER,
      subject: `New enquiry from ${cleanName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#0b0c0e;margin-bottom:4px;">New Project Enquiry</h2>
          <p style="color:#888;font-size:13px;margin-top:0;">KARIN Pvt. Ltd. - Contact Form</p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p><strong>Name:</strong> ${safeName}</p>
          <p><strong>Email:</strong> <a href="mailto:${safeEmail}">${safeEmail}</a></p>
          <p><strong>Message:</strong></p>
          <div style="background:#f9f9f9;padding:16px;border-radius:6px;color:#333;line-height:1.7;">
            ${safeMessage}
          </div>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#aaa;font-size:12px;">Sent: ${new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })} IST</p>
        </div>
      `,
    });

    await transporter.sendMail({
      from: `"KARIN Pvt. Ltd." <${process.env.SMTP_USER}>`,
      to: cleanEmail,
      subject: "We received your message - KARIN Pvt. Ltd.",
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto;padding:32px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#0b0c0e;">Thanks, ${safeName}!</h2>
          <p style="color:#444;line-height:1.7;">
            We've received your message and will get back to you within <strong>24 hours</strong>.
          </p>
          <p style="color:#444;line-height:1.7;">
            In the meantime, feel free to reply to this email with any additional details.
          </p>
          <hr style="border:none;border-top:1px solid #eee;margin:24px 0;">
          <p style="color:#888;font-size:13px;">KARIN Pvt. Ltd. - Bhopal, India - hello@karinpvt.in</p>
        </div>
      `,
    });

    res.status(201).json({
      success: true,
      message: "Message received. We'll be in touch within 24 hours.",
      id: saved._id,
    });
  } catch (err) {
    console.error("Contact route error:", err);
    res.status(500).json({ success: false, message: "Server error. Please email us directly." });
  }
});

router.get("/stats", protect, async (req, res) => {
  try {
    const now = new Date();
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);

    const yearStart = new Date(now.getFullYear(), 0, 1);
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const statsStart = weekStart < yearStart ? weekStart : yearStart;

    const [total, unread, messagesForStats, recent] = await Promise.all([
      Message.countDocuments(),
      Message.countDocuments({ isRead: false }),
      Message.find({ createdAt: { $gte: statsStart } }).select("createdAt isRead").lean(),
      Message.find().sort({ createdAt: -1 }).limit(8).lean(),
    ]);

    const weekly = Array.from({ length: 7 }, (_, i) => {
      const dayDate = new Date(weekStart);
      dayDate.setDate(weekStart.getDate() + i);
      const nextDate = new Date(dayDate);
      nextDate.setDate(dayDate.getDate() + 1);
      const messages = messagesForStats.filter((m) => {
        const created = new Date(m.createdAt);
        return created >= dayDate && created < nextDate;
      }).length;

      return {
        day: dayDate.toLocaleDateString("en-IN", { weekday: "short" }),
        messages,
      };
    });

    const monthly = monthNames.map((month, i) => ({
      month,
      messages: messagesForStats.filter((m) => {
        const created = new Date(m.createdAt);
        return created.getFullYear() === now.getFullYear() && created.getMonth() === i;
      }).length,
    }));

    const thisWeek = weekly.reduce((sum, day) => sum + day.messages, 0);

    res.json({
      success: true,
      data: {
        total,
        unread,
        thisWeek,
        readRate: total ? Math.round(((total - unread) / total) * 100) : null,
        weekly,
        monthly,
        recent,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch stats." });
  }
});

router.get("/", protect, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, parseInt(req.query.limit) || 20);
    const skip = (page - 1) * limit;

    const [messages, total] = await Promise.all([
      Message.find().sort({ createdAt: -1 }).skip(skip).limit(limit),
      Message.countDocuments(),
    ]);

    res.json({
      success: true,
      data: messages,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Failed to fetch messages." });
  }
});

router.patch("/:id/read", protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!msg) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, data: msg });
  } catch {
    res.status(500).json({ success: false, message: "Failed to update message." });
  }
});

router.delete("/:id", protect, async (req, res) => {
  try {
    const msg = await Message.findByIdAndDelete(req.params.id);
    if (!msg) return res.status(404).json({ success: false, message: "Message not found." });
    res.json({ success: true, message: "Message deleted." });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete message." });
  }
});

export default router;
