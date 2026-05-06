import {
  FolderGit2,
  Globe,
  MapPin,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";

const quickLinks = [
  { label: "Home", to: "/" },
  { label: "Stories", to: "/stories" },
  { label: "Bookmarks", to: "/bookmarks" },
  { label: "Login", to: "/login" },
];

const companyLinks = [
  {
    label: "About Project",
    href: "https://github.com/sourav81R/Scraper",
  },
  {
    label: "Live Portfolio",
    href: "https://sourav.is-a.dev",
  },
  {
    label: "GitHub Repo",
    href: "https://github.com/sourav81R",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/souravchowdhury-2003r/",
  },
];

const socialLinks = [
  {
    label: "GitHub",
    href: "https://github.com/sourav81R",
    icon: FolderGit2,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/souravchowdhury-2003r/",
    icon: UserRound,
  },
  {
    label: "Portfolio",
    href: "https://sourav.is-a.dev",
    icon: Globe,
  },
];

const contactItems = [
  {
    label: "India",
    href: "https://sourav.is-a.dev",
    icon: MapPin,
  },
  {
    label: "github.com/sourav81R",
    href: "https://github.com/sourav81R",
    icon: FolderGit2,
  },
  {
    label: "linkedin.com/in/souravchowdhury-2003r",
    href: "https://www.linkedin.com/in/souravchowdhury-2003r/",
    icon: UserRound,
  },
];

const appStoreLinks = [
  {
    label: "App Store",
    eyebrow: "Download on the",
    href: "https://www.apple.com/app-store/",
    icon: "apple",
  },
  {
    label: "Google Play",
    eyebrow: "Get it on",
    href: "https://play.google.com/store/apps",
    icon: "play",
  },
];

const AppleStoreIcon = () => (
  <svg
    aria-hidden="true"
    className="h-6 w-6"
    fill="currentColor"
    viewBox="0 0 24 24"
  >
    <path d="M16.77 12.77c.02 2.34 2.05 3.12 2.07 3.13-.02.06-.32 1.08-1.04 2.14-.63.92-1.28 1.84-2.31 1.86-1 .02-1.33-.6-2.48-.6-1.16 0-1.52.58-2.45.62-1 .04-1.76-1-2.39-1.92-1.29-1.86-2.28-5.25-.95-7.58.66-1.16 1.84-1.9 3.12-1.92.97-.02 1.89.66 2.48.66.58 0 1.68-.81 2.83-.69.48.02 1.83.19 2.7 1.46-.07.04-1.6.94-1.58 2.84Zm-2.36-5.92c.53-.64.9-1.53.8-2.41-.77.03-1.7.51-2.25 1.15-.5.57-.94 1.48-.82 2.35.86.07 1.74-.43 2.27-1.09Z" />
  </svg>
);

const GooglePlayIcon = () => (
  <svg
    aria-hidden="true"
    className="h-6 w-6"
    viewBox="0 0 24 24"
    fill="none"
  >
    <path d="M4.77 3.21 13.9 12 4.77 20.79a1.3 1.3 0 0 1-.38-.93V4.14c0-.36.14-.7.38-.93Z" fill="#00C4CC" />
    <path d="M17.26 15.37 7.01 21.05a1.28 1.28 0 0 1-1.52-.26L14.8 12l2.46 3.37Z" fill="#34A853" />
    <path d="M17.38 8.51 14.8 12 5.49 3.21c.4-.37 1-.47 1.52-.26l10.37 5.56Z" fill="#FBBC04" />
    <path d="M20.48 10.2c.69.37.69 1.24 0 1.6l-3.1 1.7L14.8 12l2.58-3.49 3.1 1.69Z" fill="#EA4335" />
  </svg>
);

const StoreIcon = ({ type }) => {
  if (type === "apple") {
    return <AppleStoreIcon />;
  }

  return <GooglePlayIcon />;
};

const Footer = () => (
  <footer className="px-4 pb-10 pt-10">
    <div className="footer-classic mx-auto w-full max-w-7xl rounded-[34px] border border-[rgba(247,164,92,0.24)] px-6 py-10 sm:px-8 lg:px-12">
      <div className="grid gap-10 md:grid-cols-2 xl:grid-cols-[1.12fr_0.82fr_0.9fr_1.1fr_1fr]">
        <div>
          <p className="text-[2rem] font-semibold italic tracking-tight text-[var(--footer-brand)]">
            HN Tracker
          </p>
          <p className="mt-4 max-w-xs text-sm leading-8 text-[var(--footer-text)]">
            Turning daily Hacker News momentum into a polished, readable, and
            bookmarkable signal feed.
          </p>

          <div className="mt-6 flex flex-wrap gap-3">
            {socialLinks.map((item) => (
              <a
                aria-label={item.label}
                className="footer-classic__social"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                <item.icon className="h-[18px] w-[18px]" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="footer-classic__heading">Quick Links</h3>
          <div className="mt-5 space-y-3.5">
            {quickLinks.map((item) => (
              <Link className="footer-classic__link" key={item.to} to={item.to}>
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <h3 className="footer-classic__heading">Company</h3>
          <div className="mt-5 space-y-3.5">
            {companyLinks.map((item) => (
              <a
                className="footer-classic__link"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="footer-classic__heading">Contact Us</h3>
          <div className="mt-5 space-y-4">
            {contactItems.map((item) => (
              <a
                className="footer-classic__contact"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                <item.icon className="h-[18px] w-[18px] text-[var(--footer-brand)]" />
                <span>{item.label}</span>
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="footer-classic__heading">Download App</h3>
          <div className="mt-5 space-y-4">
            {appStoreLinks.map((item) => (
              <a
                className="footer-classic__store"
                href={item.href}
                key={item.label}
                rel="noreferrer"
                target="_blank"
              >
                <span className="footer-classic__store-icon">
                  <StoreIcon type={item.icon} />
                </span>
                <span className="min-w-0 leading-none">
                  <span className="block text-[0.7rem] uppercase tracking-[0.08em] text-[var(--text-secondary)]">
                    {item.eyebrow}
                  </span>
                  <span className="mt-1 block text-[1.05rem] font-semibold text-[var(--text-primary)]">
                    {item.label}
                  </span>
                </span>
              </a>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-10 border-t border-[rgba(148,163,184,0.2)] pt-6 text-center text-sm text-[var(--footer-text)]">
        Copyright 2026 HN Tracker. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
