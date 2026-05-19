import express from "express";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

/* ════════════════════════════════════
   POST /api/auth/login
   Public — admin login, returns JWT
════════════════════════════════════ */
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: "Username and password required." });
    }

    const admin = await Admin.findOne({ username: username.toLowerCase().trim() });
    if (!admin) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const match = await admin.comparePassword(password);
    if (!match) {
      return res.status(401).json({ success: false, message: "Invalid credentials." });
    }

    const token = jwt.sign(
      { id: admin._id, username: admin.username },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
    );

    res.json({
      success: true,
      token,
      admin: { id: admin._id, username: admin.username },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ success: false, message: "Server error." });
  }
});

/* ════════════════════════════════════
   GET /api/auth/me
   Protected — verify token & return admin info
════════════════════════════════════ */
router.get("/me", protect, async (req, res) => {
  try {
    const admin = await Admin.findById(req.admin.id).select("-password");
    if (!admin) return res.status(404).json({ success: false, message: "Admin not found." });
    res.json({ success: true, admin });
  } catch {
    res.status(500).json({ success: false, message: "Server error." });
  }
});

export default router;
