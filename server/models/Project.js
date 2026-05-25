import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
    title: { type: String, required: true, trim: true, maxlength: 140 },
    category: { type: String, trim: true, maxlength: 120 },
    year: { type: String, trim: true, maxlength: 12 },
    type: { type: String, trim: true, maxlength: 120 },
    desc: { type: String, required: true, trim: true, maxlength: 1600 },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    color: { type: String, trim: true, maxlength: 20, default: "#c8f564" },
    image: { type: String, trim: true },
    imageAlt: { type: String, trim: true, maxlength: 180 },
    videoUrl: { type: String, trim: true },
    duration: { type: String, trim: true, maxlength: 40 },
    summary: { type: String, trim: true, maxlength: 1800 },
    problem: { type: String, trim: true, maxlength: 2400 },
    approach: { type: String, trim: true, maxlength: 2400 },
    challenges: { type: String, trim: true, maxlength: 2400 },
    goals: [{ type: String, trim: true, maxlength: 240 }],
    outcomes: [{ type: String, trim: true, maxlength: 240 }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Project", projectSchema);
