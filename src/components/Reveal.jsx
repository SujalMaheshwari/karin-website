import { motion, useReducedMotion } from "framer-motion";

export default function Reveal({ children, delay = 0, className = "", style = {} }) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={reduceMotion ? false : { opacity: 0, y: 54, scale: 0.98, filter: "blur(10px)" }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }}
      viewport={{ once: false, amount: 0.22, margin: "0px 0px -80px 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  );
}
