import mongoose from "mongoose";

const teamMemberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    bio: { type: String, required: true, trim: true, maxlength: 1200 },
    initial: { type: String, trim: true, uppercase: true, maxlength: 8 },
    image: { type: String, trim: true },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model("TeamMember", teamMemberSchema);
