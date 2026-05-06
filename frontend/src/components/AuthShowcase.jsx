import { motion } from "framer-motion";
import { ArrowUpRight, Bookmark, Newspaper, Sparkles } from "lucide-react";

const authHighlights = [
  {
    title: "Track momentum",
    copy: "See which Hacker News links are gathering points and comments fastest.",
    icon: Newspaper,
  },
  {
    title: "Keep a signal-rich queue",
    copy: "Save standout stories into a persistent bookmark list across devices.",
    icon: Bookmark,
  },
  {
    title: "Built like a product",
    copy: "Production-minded architecture, thoughtful UX, and deploy-ready flows.",
    icon: Sparkles,
  },
];

const AuthShowcase = ({ caption, title }) => (
  <div className="relative hidden overflow-hidden rounded-[34px] border border-white/10 bg-[#0f172a] px-7 py-8 text-white lg:flex lg:flex-col">
    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(99,102,241,0.28),transparent_35%),linear-gradient(135deg,rgba(15,23,42,0.96),rgba(15,23,42,0.82))]" />
    <div className="relative z-10">
      <p className="text-xs font-semibold uppercase tracking-[0.32em] text-indigo-200">
        {caption}
      </p>
      <h2 className="mt-4 max-w-lg text-[2.7rem] font-semibold leading-tight">
        {title}
      </h2>
      <p className="mt-4 max-w-md text-sm leading-7 text-slate-300">
        This polished workflow pairs reliable backend infrastructure with a crisp,
        responsive interface designed to feel credible in front of recruiters and
        hiring teams.
      </p>
      <div className="mt-7 space-y-3.5">
        {authHighlights.map((highlight, index) => (
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="rounded-[22px] border border-white/10 bg-white/5 p-3.5 backdrop-blur-xl"
            initial={{ opacity: 0, y: 14 }}
            key={highlight.title}
            transition={{ delay: 0.1 * index }}
          >
            <div className="flex items-start gap-3">
              <span className="mt-0.5 rounded-2xl border border-white/10 bg-white/10 p-2 text-indigo-200">
                <highlight.icon className="h-[18px] w-[18px]" />
              </span>
              <div>
                <p className="font-medium text-white">{highlight.title}</p>
                <p className="mt-1 text-sm text-slate-300">{highlight.copy}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-8 flex items-center gap-2 text-sm text-slate-300">
        <span>Explore the live story feed</span>
        <ArrowUpRight className="h-4 w-4" />
      </div>
    </div>
  </div>
);

export default AuthShowcase;
