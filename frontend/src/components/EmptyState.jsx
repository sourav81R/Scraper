import { motion } from "framer-motion";
import Button from "./Button";

const EmptyState = ({
  action,
  description,
  eyebrow = "Nothing here yet",
  title,
}) => (
  <motion.div
    animate={{ opacity: 1, y: 0 }}
    className="glass-panel rounded-[32px] border border-[var(--border)] px-6 py-10 text-center sm:px-10"
    initial={{ opacity: 0, y: 18 }}
  >
    <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
      {eyebrow}
    </p>
    <h3 className="mt-4 text-2xl font-semibold text-[var(--text-primary)]">
      {title}
    </h3>
    <p className="mx-auto mt-3 max-w-xl text-sm text-[var(--text-secondary)]">
      {description}
    </p>
    {action ? <div className="mt-6 flex justify-center">{action}</div> : null}
  </motion.div>
);

export default EmptyState;
