import { Database, LayoutDashboard, ShieldCheck, Sparkles } from "lucide-react";
import PageTransition from "../components/PageTransition";

const features = [
  {
    icon: Database,
    title: "Live Story Scraping",
    description:
      "The app collects Hacker News stories, stores them in MongoDB, and keeps the feed ready for fast browsing.",
  },
  {
    icon: ShieldCheck,
    title: "Authentication",
    description:
      "Users can sign in with email or Google auth, then access protected stories and bookmarks safely.",
  },
  {
    icon: LayoutDashboard,
    title: "Signal-Focused Experience",
    description:
      "The interface is designed to help readers search, filter, sort, and save the strongest stories quickly.",
  },
  {
    icon: Sparkles,
    title: "Product-Style UI",
    description:
      "HN Tracker is built to feel more like a polished SaaS product than a basic assignment demo.",
  },
];

const About = () => (
  <PageTransition>
    <main className="mx-auto flex w-full max-w-7xl flex-col gap-8 px-4 pb-14 pt-10 sm:px-6 lg:px-8">
      <section className="glass-panel rounded-[32px] border border-[var(--premium-border)] px-6 py-8 sm:px-8 sm:py-10">
        <p className="text-[0.82rem] font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          About This Project
        </p>
        <h1 className="mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.04em] text-[var(--text-primary)] sm:text-5xl">
          HN Tracker turns raw Hacker News activity into a cleaner, smarter reading workflow.
        </h1>
        <p className="mt-5 max-w-3xl text-base leading-8 text-[var(--text-secondary)] sm:text-lg">
          This project is a full-stack MERN application built to scrape, store, and present
          Hacker News stories in a more useful way. Instead of only showing a raw feed, it
          adds authentication, bookmarks, filtering, sorting, and a premium product-style
          interface so users can focus on the links that matter most.
        </p>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        {features.map((feature) => (
          <article
            className="glass-panel rounded-[28px] border border-[var(--premium-border)] px-6 py-6"
            key={feature.title}
          >
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--premium-border)] bg-[rgba(99,102,241,0.1)] text-[var(--accent)]">
              <feature.icon className="h-5 w-5" />
            </div>
            <h2 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
              {feature.title}
            </h2>
            <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)] sm:text-base">
              {feature.description}
            </p>
          </article>
        ))}
      </section>

      <section className="glass-panel rounded-[32px] border border-[var(--premium-border)] px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-[-0.03em] text-[var(--text-primary)]">
          Why it was built
        </h2>
        <p className="mt-4 max-w-4xl text-base leading-8 text-[var(--text-secondary)]">
          The goal of HN Tracker is to show both technical depth and product thinking in one
          project. It combines backend scraping logic, database integration, authentication,
          protected routes, API-driven UI, and a refined frontend design system. The result
          is a recruiter-friendly project that demonstrates how data collection and thoughtful
          presentation can work together in a real application.
        </p>
      </section>
    </main>
  </PageTransition>
);

export default About;
