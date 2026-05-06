const techBadges = [
  "MongoDB",
  "Express",
  "React",
  "Node.js",
  "Tailwind",
  "Framer Motion",
];

const Footer = () => (
  <footer className="px-4 pb-10 pt-8">
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 rounded-[32px] border border-[var(--border)] bg-[var(--panel)]/70 px-6 py-8 backdrop-blur-xl sm:px-8 lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[var(--accent)]">
          HackerNews Story Tracker
        </p>
        <p className="mt-3 max-w-2xl text-sm text-[var(--text-secondary)]">
          A recruiter-facing MERN product that turns Hacker News scraping,
          authentication, bookmarks, and story intelligence into a polished SaaS-like
          experience.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {techBadges.map((badge) => (
            <span
              className="rounded-full border border-[var(--border)] bg-[var(--panel-strong)] px-3 py-1 text-xs font-medium text-[var(--text-secondary)]"
              key={badge}
            >
              {badge}
            </span>
          ))}
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-[var(--text-secondary)]">
          <a
            className="transition hover:text-[var(--text-primary)]"
            href="https://news.ycombinator.com"
            rel="noreferrer"
            target="_blank"
          >
            Hacker News
          </a>
          <a
            className="transition hover:text-[var(--text-primary)]"
            href="https://github.com/sourav81R/Scraper"
            rel="noreferrer"
            target="_blank"
          >
            Source Code
          </a>
          <a
            className="transition hover:text-[var(--text-primary)]"
            href="https://scraper-hn.vercel.app/"
            rel="noreferrer"
            target="_blank"
          >
            Live Frontend
          </a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
