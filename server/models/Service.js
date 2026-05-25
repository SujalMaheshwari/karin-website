import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 120 },
    desc: { type: String, required: true, trim: true, maxlength: 1200 },
    icon: { type: String, trim: true, maxlength: 40, default: "AI" },
    tags: [{ type: String, trim: true, maxlength: 40 }],
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("Service", serviceSchema);
