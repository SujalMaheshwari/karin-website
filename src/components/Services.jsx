import { motion, useReducedMotion } from "framer-motion";
import Reveal from "./Reveal.jsx";
import "./Services.css";

const cardVariants = {
  hidden: { opacity: 0, y: 34 },
  show: (index) => ({
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] },
  }),
};

export default function Services({ services = [], loading = false }) {
  const reduceMotion = useReducedMotion();

  return (
    <section id="services" className={loading ? "services-section is-loading" : "services-section"}>
      <Reveal>
        <div className="sec-head">
          <div>
            <div className="sec-label">What We Do</div>
            <h2 className="sec-title">Our <em>Services</em></h2>
          </div>
        </div>
      </Reveal>

      <div className="services-grid">
        {services.map((service, index) => (
          <motion.article
            className="svc-card"
            key={service._id || service.title}
            custom={index}
            variants={cardVariants}
            initial={reduceMotion ? false : "hidden"}
            whileInView={reduceMotion ? undefined : "show"}
            viewport={{ once: true, amount: 0.2 }}
            whileHover={reduceMotion ? undefined : { y: -8, scale: 1.01 }}
            transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="svc-light" />
            <motion.span
              className="svc-icon"
              whileHover={reduceMotion ? undefined : { rotate: 8, scale: 1.12 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
            >
              {service.icon || "AI"}
            </motion.span>
            <h3 className="svc-title">{service.title}</h3>
            <p className="svc-desc">{service.desc}</p>
            <div className="svc-tags">
              {(service.tags || []).map((tag) => (
                <span className="tag" key={tag}>{tag}</span>
              ))}
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
