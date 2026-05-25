import { useState } from "react";
import { useSiteContent } from "../hooks/useSiteContent.js";
import Reveal from "./Reveal.jsx";
import "./FAQ.css";

export default function FAQ() {
  const { content } = useSiteContent();
  const faqs = content.faqs;
  const [open, setOpen] = useState(null);

  const toggle = (i) => setOpen(open === i ? null : i);

  return (
    <div className="faq-bg">
      <section id="faq" className="faq-section">
        <Reveal>
          <div className="sec-head">
            <div>
              <div className="sec-label">Quick Answers</div>
              <h2 className="sec-title">Frequently <em>Asked</em></h2>
            </div>
          </div>
        </Reveal>

        <div className="faq-list">
          {faqs.map((item, i) => (
            <Reveal key={item._id || i} delay={i * 0.06}>
              <div
                className={`faq-item ${open === i ? "open" : ""}`}
                onClick={() => toggle(i)}
                data-hover
              >
                <div className="faq-question">
                  <span>{item.q}</span>
                  <span className="faq-icon">{open === i ? "−" : "+"}</span>
                </div>
                <div
                  className="faq-answer"
                  style={{ maxHeight: open === i ? "400px" : "0" }}
                >
                  <p>{item.a}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}