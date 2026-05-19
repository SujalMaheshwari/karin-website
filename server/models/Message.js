import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    name:      { type: String, required: true, trim: true, maxlength: 100 },
    email:     { type: String, required: true, trim: true, lowercase: true },
    message:   { type: String, required: true, trim: true, maxlength: 3000 },
    isRead:    { type: Boolean, default: false },
    ipAddress: { type: String },
  },
  { timestamps: true } // adds createdAt + updatedAt automatically
);

export default mongoose.model("Message", messageSchema);
