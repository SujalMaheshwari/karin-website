import { useState } from "react";
import Reveal from "./Reveal.jsx";
import { submitContact } from "../services/contact.js";
import "./Contact.css";

export default function Contact({ toast }) {
  const [formData, setFormData]   = useState({ name: "", email: "", message: "" });
  const [sending, setSending]     = useState(false);
  const [success, setSuccess]     = useState(false);

  const handleForm = async (e) => {
    e.preventDefault();
    setSending(true);

    try {
      const data = await submitContact(formData);

      if (data.success) {
        setSuccess(true);
        setFormData({ name: "", email: "", message: "" });
        toast.success("Message received! We'll be in touch within 24 hours.");
        setTimeout(() => setSuccess(false), 6000);
      } else {
        toast.error(data.message || "Something went wrong. Please try again.");
      }
    } catch {
      toast.error("Cannot reach server. Email us at hello@karinpvt.in");
    } finally {
      setSending(false);
    }
  };

  const set = (field) => (e) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));

  return (
    <div className="contact-bg">
      <div className="contact-inner" id="contact">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">Get In Touch</div>
              <h2 className="sec-title">Start a <em>Project</em></h2>
            </div>
          </div>
        </Reveal>

        <div className="contact-grid">
          {/* LEFT — Info */}
          <Reveal delay={0.05}>
            <div className="contact-info">
              <p>
                We're a focused engineering studio — we take on projects where
                we can genuinely make a difference. Tell us what you're building
                and we'll respond within 24 hours.
              </p>
              <a href="mailto:hello@karinpvt.in" className="big-email">
                hello@karinpvt.in
              </a>
              <div className="contact-meta">
                <div className="cmr"><span className="icon">◎</span> Bhopal, Madhya Pradesh, India</div>
                <div className="cmr"><span className="icon">◷</span> Mon–Sat · 10am–7pm IST</div>
                <div className="cmr"><span className="icon">◈</span> KARIN Pvt. Ltd. · Est. 2025</div>
              </div>
            </div>
          </Reveal>

          {/* RIGHT — Form */}
          <Reveal delay={0.13}>
            <form className="contact-form" onSubmit={handleForm}>
              {success && (
                <div className="form-success-banner">
                  ✓ Message sent — we'll be in touch within 24 hours.
                </div>
              )}

              {!success && (
                <>
                  <div className="form-group">
                    <label className="form-label">Your Name</label>
                    <input
                      className="form-input"
                      type="text"
                      placeholder="Riya Sharma"
                      required
                      value={formData.name}
                      onChange={set("name")}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="riya@company.com"
                      required
                      value={formData.email}
                      onChange={set("email")}
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Tell Us About Your Project</label>
                    <textarea
                      className="form-textarea"
                      placeholder="We're building a SaaS platform for..."
                      required
                      value={formData.message}
                      onChange={set("message")}
                    />
                  </div>
                  <button
                    type="submit"
                    className="form-submit"
                    disabled={sending}
                  >
                    {sending ? "Sending…" : "Send Message →"}
                  </button>
                </>
              )}
            </form>
          </Reveal>
        </div>
      </div>
    </div>
  );
}
