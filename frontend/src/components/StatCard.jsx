import { motion } from "framer-motion";
import { cn } from "../lib/utils";

const StatCard = ({ description, icon: Icon, title, value }) => (
  <motion.div
    className={cn(
      "glass-panel rounded-[28px] border border-[var(--border)] p-5 shadow-[0_18px_60px_rgba(15,23,42,0.08)]"
    )}
    whileHover={{ y: -4, scale: 1.01 }}
  >
    <div className="flex items-center justify-between">
      <span className="text-sm text-[var(--text-secondary)]">{title}</span>
      {Icon ? (
        <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel-strong)] text-[var(--accent)]">
          <Icon className="h-5 w-5" />
        </span>
      ) : null}
    </div>
    <p className="mt-6 text-3xl font-semibold tracking-tight text-[var(--text-primary)]">
      {value}
    </p>
    {description ? (
      <p className="mt-2 text-sm text-[var(--text-secondary)]">{description}</p>
    ) : null}
  </motion.div>
);

export default StatCard;
