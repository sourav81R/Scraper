import { AnimatePresence, motion } from "framer-motion";
import {
  BookMarked,
  ChevronDown,
  Menu,
  Newspaper,
  Sparkles,
  X,
} from "lucide-react";
import { useState } from "react";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { cn } from "../lib/utils";
import Button from "./Button";
import ThemeToggle from "./ThemeToggle";

const navigationItems = [
  { label: "Home", to: "/" },
  { label: "Stories", to: "/stories" },
];

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, logout, user } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const getNavigationTarget = (targetPath) =>
    targetPath === "/stories" && !isAuthenticated
      ? {
          pathname: "/login",
          state: { from: targetPath },
        }
      : targetPath;

  const isStoriesActive =
    location.pathname === "/stories" ||
    (!isAuthenticated &&
      location.pathname === "/login" &&
      location.state?.from === "/stories");

  const handleLogout = async () => {
    await logout();
    setProfileOpen(false);
    setMobileOpen(false);
    navigate("/");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--border)] bg-[var(--page-veil)]/80 backdrop-blur-2xl">
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <Link className="flex items-center gap-3" to="/">
          <span className="flex h-11 w-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--panel)] text-[var(--accent)] shadow-[0_12px_40px_rgba(15,23,42,0.08)]">
            <Newspaper className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-semibold tracking-tight text-[var(--text-primary)]">
              HN Tracker
            </p>
            <p className="text-xs text-[var(--text-secondary)]">
              Recruiter-ready story intelligence
            </p>
          </div>
        </Link>

        <nav className="hidden items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--panel)] px-3 py-2 lg:flex">
          {navigationItems.map((item) => (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive || (item.to === "/stories" && isStoriesActive)
                    ? "bg-[var(--panel-strong)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )
              }
              key={item.to}
              to={getNavigationTarget(item.to)}
            >
              {item.label}
            </NavLink>
          ))}
          {isAuthenticated ? (
            <NavLink
              className={({ isActive }) =>
                cn(
                  "rounded-full px-4 py-2 text-sm font-medium transition",
                  isActive
                    ? "bg-[var(--panel-strong)] text-[var(--text-primary)]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                )
              }
              to="/bookmarks"
            >
              Bookmarks
            </NavLink>
          ) : null}
        </nav>

        <div className="hidden items-center gap-3 lg:flex">
          <ThemeToggle />
          {isAuthenticated ? (
            <div className="relative">
              <button
                className="inline-flex items-center gap-3 rounded-full border border-[var(--border)] bg-[var(--panel)] px-4 py-2 text-left transition hover:border-[var(--border-strong)]"
                onClick={() => setProfileOpen((currentOpen) => !currentOpen)}
                type="button"
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--accent-soft)] text-xs font-semibold text-[var(--accent)]">
                  {user?.name?.slice(0, 2).toUpperCase() || "HN"}
                </span>
                <div className="max-w-[140px]">
                  <p className="truncate text-sm font-medium text-[var(--text-primary)]">
                    {user?.name}
                  </p>
                  <p className="truncate text-xs text-[var(--text-secondary)]">
                    {user?.bookmarks?.length || 0} saved stories
                  </p>
                </div>
                <ChevronDown className="h-4 w-4 text-[var(--text-secondary)]" />
              </button>
              <AnimatePresence>
                {profileOpen ? (
                  <motion.div
                    animate={{ opacity: 1, y: 0 }}
                    className="glass-panel absolute right-0 mt-3 w-64 rounded-[24px] border border-[var(--border)] p-3 shadow-2xl"
                    exit={{ opacity: 0, y: -8 }}
                    initial={{ opacity: 0, y: -10 }}
                  >
                    <Link
                      className="flex items-center gap-3 rounded-2xl px-3 py-3 text-sm text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-[var(--text-primary)]"
                      onClick={() => setProfileOpen(false)}
                      to="/bookmarks"
                    >
                      <BookMarked className="h-4 w-4" />
                      View bookmarks
                    </Link>
                    <button
                      className="mt-2 flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm text-[var(--text-secondary)] transition hover:bg-white/5 hover:text-[var(--text-primary)]"
                      onClick={handleLogout}
                      type="button"
                    >
                      <Sparkles className="h-4 w-4" />
                      Sign out
                    </button>
                  </motion.div>
                ) : null}
              </AnimatePresence>
            </div>
          ) : (
            <>
              <NavLink
                className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                to="/login"
              >
                Login
              </NavLink>
              <Button onClick={() => navigate("/register")} size="md">
                Get started
              </Button>
            </>
          )}
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <ThemeToggle />
          <button
            aria-label="Open navigation"
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--panel)] text-[var(--text-primary)]"
            onClick={() => setMobileOpen((currentOpen) => !currentOpen)}
            type="button"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen ? (
          <motion.div
            animate={{ opacity: 1, height: "auto" }}
            className="border-t border-[var(--border)] bg-[var(--page-veil)]/95 px-4 pb-5 pt-4 backdrop-blur-xl lg:hidden"
            exit={{ opacity: 0, height: 0 }}
            initial={{ opacity: 0, height: 0 }}
          >
            <div className="mx-auto flex w-full max-w-7xl flex-col gap-3">
              {navigationItems.map((item) => (
                <NavLink
                  className={({ isActive }) =>
                    cn(
                      "rounded-2xl px-4 py-3 text-sm font-medium transition",
                      isActive || (item.to === "/stories" && isStoriesActive)
                        ? "bg-[var(--panel)] text-[var(--text-primary)]"
                        : "text-[var(--text-secondary)] hover:bg-[var(--panel)]"
                    )
                  }
                  key={item.to}
                  onClick={() => setMobileOpen(false)}
                  to={getNavigationTarget(item.to)}
                >
                  {item.label}
                </NavLink>
              ))}
              {isAuthenticated ? (
                <>
                  <NavLink
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
                    onClick={() => setMobileOpen(false)}
                    to="/bookmarks"
                  >
                    Bookmarks ({user?.bookmarks?.length || 0})
                  </NavLink>
                  <Button className="w-full justify-center" onClick={handleLogout}>
                    Sign out
                  </Button>
                </>
              ) : (
                <>
                  <NavLink
                    className="rounded-2xl px-4 py-3 text-sm font-medium text-[var(--text-secondary)] transition hover:bg-[var(--panel)] hover:text-[var(--text-primary)]"
                    onClick={() => setMobileOpen(false)}
                    to="/login"
                  >
                    Login
                  </NavLink>
                  <Button
                    className="w-full justify-center"
                    onClick={() => {
                      setMobileOpen(false);
                      navigate("/register");
                    }}
                  >
                    Register
                  </Button>
                </>
              )}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
};

export default Navbar;
