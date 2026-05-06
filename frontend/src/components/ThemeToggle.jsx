import { MoonStar, SunMedium } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ThemeToggle = () => {
  const { isDark, toggleTheme } = useTheme();

  return (
    <button
      aria-label="Toggle color theme"
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)] text-[var(--text-secondary)] transition hover:border-[var(--border-strong)] hover:text-[var(--text-primary)]"
      onClick={toggleTheme}
      type="button"
    >
      {isDark ? <SunMedium className="h-5 w-5" /> : <MoonStar className="h-5 w-5" />}
    </button>
  );
};

export default ThemeToggle;
