import express from "express";
import Service from "../models/Service.js";
import Project from "../models/Project.js";
import TeamMember from "../models/TeamMember.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

const resources = {
  services: Service,
  projects: Project,
  team: TeamMember,
};

const listSort = { order: 1, createdAt: 1 };

const asArray = (value) => {
  if (Array.isArray(value)) return value.map(String).map((v) => v.trim()).filter(Boolean);
  if (typeof value === "string") {
    return value.split(",").map((v) => v.trim()).filter(Boolean);
  }
  return [];
};

const slugify = (value = "") =>
  String(value)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);

const pickPayload = (resource, body) => {
  if (resource === "services") {
    return {
      title: body.title,
      desc: body.desc,
      icon: body.icon || "AI",
      tags: asArray(body.tags),
      order: Number(body.order || 0),
      visible: body.visible !== false,
    };
  }

  if (resource === "projects") {
    return {
      slug: slugify(body.slug || body.id || body.title),
      title: body.title,
      category: body.category || "",
      year: body.year || "",
      type: body.type || "",
      desc: body.desc,
      tags: asArray(body.tags),
      color: body.color || "#c8f564",
      image: body.image || "",
      imageAlt: body.imageAlt || body.title || "",
      videoUrl: body.videoUrl || "",
      duration: body.duration || "",
      summary: body.summary || body.desc || "",
      problem: body.problem || "",
      approach: body.approach || "",
      challenges: body.challenges || "",
      goals: asArray(body.goals),
      outcomes: asArray(body.outcomes),
      order: Number(body.order || 0),
      visible: body.visible !== false,
    };
  }

  return {
    name: body.name,
    role: body.role,
    bio: body.bio,
    initial: body.initial || String(body.name || "").split(" ").map((p) => p[0]).join("").slice(0, 3),
    image: body.image || "",
    order: Number(body.order || 0),
    visible: body.visible !== false,
  };
};

const getModel = (resource) => resources[resource];

router.get("/", async (_req, res) => {
  try {
    const visible = { visible: { $ne: false } };
    const [services, projects, team] = await Promise.all([
      Service.find(visible).sort(listSort).lean(),
      Project.find(visible).sort(listSort).lean(),
      TeamMember.find(visible).sort(listSort).lean(),
    ]);

    res.json({
      success: true,
      data: { services, projects, team },
    });
  } catch (err) {
    console.error("CMS fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch website content." });
  }
});

router.get("/:resource", protect, async (req, res) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) return res.status(404).json({ success: false, message: "CMS resource not found." });

    const data = await Model.find().sort(listSort).lean();
    res.json({ success: true, data });
  } catch {
    res.status(500).json({ success: false, message: "Failed to fetch CMS resource." });
  }
});

router.post("/:resource", protect, async (req, res) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) return res.status(404).json({ success: false, message: "CMS resource not found." });

    const item = await Model.create(pickPayload(req.params.resource, req.body));
    res.status(201).json({ success: true, data: item });
  } catch (err) {
    const message = err.code === 11000
      ? "A project with this slug already exists."
      : "Failed to create CMS item.";
    res.status(400).json({ success: false, message });
  }
});

router.patch("/:resource/:id", protect, async (req, res) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) return res.status(404).json({ success: false, message: "CMS resource not found." });

    const item = await Model.findByIdAndUpdate(
      req.params.id,
      pickPayload(req.params.resource, req.body),
      { new: true, runValidators: true }
    );
    if (!item) return res.status(404).json({ success: false, message: "CMS item not found." });

    res.json({ success: true, data: item });
  } catch (err) {
    const message = err.code === 11000
      ? "A project with this slug already exists."
      : "Failed to update CMS item.";
    res.status(400).json({ success: false, message });
  }
});

router.delete("/:resource/:id", protect, async (req, res) => {
  try {
    const Model = getModel(req.params.resource);
    if (!Model) return res.status(404).json({ success: false, message: "CMS resource not found." });

    const item = await Model.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ success: false, message: "CMS item not found." });

    res.json({ success: true, message: "CMS item deleted." });
  } catch {
    res.status(500).json({ success: false, message: "Failed to delete CMS item." });
  }
});

export default router;
