import mongoose from "mongoose";

const testimonialSchema = new mongoose.Schema(
{
    quote: { type: String, required: true, trim: true, maxlength: 1200 },
    name: { type: String, required: true, trim: true, maxlength: 120 },
    role: { type: String, required: true, trim: true, maxlength: 120 },
    company: { type: String, required: true, trim: true, maxlength: 120 },
    initial: { type: String, trim: true, uppercase: true, maxlength: 8 },
    order: { type: Number, default: 0 },
    visible: { type: Boolean, default: true },
},
{ timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);