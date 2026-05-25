import mongoose from "mongoose";

const faqSchema = new mongoose.Schema(
{
  q: { type: String, required: true, trim: true, maxlength: 300 },
  a: { type: String, required: true, trim: true, maxlength: 2000 },
  order: { type: Number, default: 0 },
  visible: { type: Boolean, default: true },
},
{ timestamps: true }
);

export default mongoose.model("Faq", faqSchema);