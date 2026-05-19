import express from "express";
import cors from "cors";
import rateLimit from "express-rate-limit";

import contactRoutes from "./routes/contact.js";
import authRoutes from "./routes/auth.js";

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || "http://localhost:5173",
  credentials: true,
}));

app.use(express.json({ limit: "10kb" }));
app.use(express.urlencoded({ extended: true }));

app.use(rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
}));

app.use("/api/contact", contactRoutes);
app.use("/api/auth", authRoutes);

app.get("/api/health", (_, res) => {
  res.json({
    success: true,
    service: "KARIN Backend",
    status: "running",
    time: new Date().toISOString(),
  });
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.method} ${req.path} not found.`,
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  res.status(500).json({ success: false, message: "Internal server error." });
});

export default app;
