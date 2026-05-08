import { motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookmarkCheck,
  Flame,
  Gauge,
  Globe2,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { storiesApi } from "../api/services";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import StatCard from "../components/StatCard";
import StoryCard from "../components/StoryCard";
import Button from "../components/Button";
import { useStories } from "../context/StoryContext";
import { useAuth } from "../context/AuthContext";
import { useToast } from "../context/ToastContext";
import {
  formatRelativeTime,
  normalizeApiError,
  readSessionCache,
  writeSessionCache,
} from "../lib/utils";

const featureCards = [
  {
    title: "High-signal surfacing",
    copy: "Sort by points, freshness, and comment velocity to find the stories worth your time.",
    icon: Gauge,
  },
  {
    title: "Bookmark-first workflow",
    copy: "Save promising links into a persistent reading queue across sessions and devices.",
    icon: BookmarkCheck,
  },
  {
    title: "Global domain pulse",
    copy: "Track which sites dominate Hacker News without leaving a single responsive dashboard.",
    icon: Globe2,
  },
];
const HOME_DASHBOARD_CACHE_KEY = "hn-tracker-home-dashboard";

const Home = () => {
  const navigate = useNavigate();
  const { toggleBookmark } = useStories();
  const { isAuthenticated, user } = useAuth();
  const { pushToast } = useToast();
  const [cachedDashboard] = useState(() =>
    readSessionCache(HOME_DASHBOARD_CACHE_KEY, null)
  );
  const [stats, setStats] = useState(() => cachedDashboard?.stats || null);
  const [stories, setStories] = useState(() => cachedDashboard?.stories || []);
  const [loading, setLoading] = useState(() => !cachedDashboard);
  const [bookmarkPendingId, setBookmarkPendingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadDashboard = async () => {
      try {
        if (!cachedDashboard) {
          setLoading(true);
        }

        const response = await storiesApi.home();

        if (!cancelled) {
          setStats(response.data.stats);
          setStories(response.data.stories);
          writeSessionCache(HOME_DASHBOARD_CACHE_KEY, response.data);
        }
      } catch (error) {
        if (!cancelled) {
          pushToast({
            title: cachedDashboard
              ? "Showing saved dashboard data"
              : "Unable to load the dashboard",
            description: cachedDashboard
              ? "The latest refresh failed, so the last loaded dashboard is still available."
              : normalizeApiError(error, "Please try again shortly."),
            variant: cachedDashboard ? "warning" : "error",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      cancelled = true;
    };
  }, [cachedDashboard, pushToast]);

  const handleBookmark = async (storyId) => {
    try {
      setBookmarkPendingId(storyId);
      const response = await toggleBookmark(storyId);
      pushToast({
        title: response.data.bookmarked ? "Story saved" : "Bookmark removed",
        description: response.message,
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "Bookmark update failed",
        description: normalizeApiError(error, "Please try again."),
        variant: "error",
      });
    } finally {
      setBookmarkPendingId("");
    }
  };

  const handleStoriesAccess = () => {
    if (isAuthenticated) {
      navigate("/stories");
      return;
    }

    navigate("/login", { state: { from: "/stories" } });
  };

  const handleBookmarksAccess = () => {
    if (isAuthenticated) {
      navigate("/bookmarks");
      return;
    }

    navigate("/login", { state: { from: "/bookmarks" } });
  };

  return (
    <PageTransition className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="grid gap-8 lg:grid-cols-[1.3fr_0.7fr]">
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel relative overflow-hidden rounded-[40px] border border-[var(--border)] px-6 py-8 sm:px-8 lg:px-10"
            initial={{ opacity: 0, y: 20 }}
          >
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(99,102,241,0.24),transparent_38%),radial-gradient(circle_at_bottom_right,_rgba(248,113,113,0.18),transparent_32%)]" />
            <div className="relative z-10">
              <p className="text-xs font-semibold uppercase tracking-[0.34em] text-[var(--accent)]">
                Modern story intelligence
              </p>
              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[var(--text-primary)] sm:text-5xl lg:text-6xl">
                Turn Hacker News momentum into a clean, bookmarkable signal feed.
              </h1>
              <p className="mt-5 max-w-2xl text-base leading-8 text-[var(--text-secondary)]">
                Scraped automatically, ranked clearly, and packaged in a polished
                interface that feels more like a startup product than an assignment.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Button className="min-w-[170px]" onClick={handleStoriesAccess}>
                  Explore stories
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button
                  className="min-w-[170px]"
                  onClick={handleBookmarksAccess}
                  variant="secondary"
                >
                  Open bookmarks
                </Button>
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)]/80 p-4">
                  <p className="text-sm text-[var(--text-secondary)]">Last scrape</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {stats?.lastScrapedAt
                      ? formatRelativeTime(stats.lastScrapedAt)
                      : "Syncing"}
                  </p>
                </div>
                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)]/80 p-4">
                  <p className="text-sm text-[var(--text-secondary)]">Saved by you</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {user?.bookmarks?.length || 0}
                  </p>
                </div>
                <div className="rounded-[28px] border border-[var(--border)] bg-[var(--panel)]/80 p-4">
                  <p className="text-sm text-[var(--text-secondary)]">Peak points</p>
                  <p className="mt-2 text-lg font-semibold text-[var(--text-primary)]">
                    {stats?.maxPoints || 0}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ opacity: 1, y: 0 }}
            className="glass-panel rounded-[40px] border border-[var(--border)] p-6"
            initial={{ opacity: 0, y: 24 }}
            transition={{ delay: 0.08 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-[var(--text-secondary)]">Live signal board</p>
                <h2 className="mt-2 text-2xl font-semibold text-[var(--text-primary)]">
                  What is trending right now
                </h2>
              </div>
              <span className="rounded-full bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--accent)]">
                Top 3
              </span>
            </div>

            <div className="mt-6 space-y-4">
              {stories.map((story, index) => (
                <div
                  className="rounded-[24px] border border-[var(--border)] bg-[var(--panel-strong)] p-4"
                  key={story._id}
                >
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                      <Flame className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-[var(--text-muted)]">
                        Story {index + 1}
                      </p>
                      <p className="text-sm font-semibold text-[var(--text-primary)]">
                        {story.title}
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-[var(--text-secondary)]">
                    <span>{story.domain}</span>
                    <span>{story.points} pts</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            description="Tracked and ready to sort"
            icon={BarChart3}
            title="Stories indexed"
            value={stats?.totalStories || 0}
          />
          <StatCard
            description="Average score across the feed"
            icon={Flame}
            title="Average points"
            value={stats?.avgPoints || 0}
          />
          <StatCard
            description="Unique sites appearing in the top stories"
            icon={Globe2}
            title="Active domains"
            value={stats?.uniqueDomains || 0}
          />
          <StatCard
            description="Persistent saves across accounts"
            icon={BookmarkCheck}
            title="Bookmarks stored"
            value={stats?.totalBookmarks || 0}
          />
        </section>

        <section className="grid gap-8 lg:grid-cols-[1fr_0.92fr]">
          <div>
            <div className="mb-4 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[var(--accent)]">
                  Featured stories
                </p>
                <h2 className="mt-2 text-2xl font-semibold leading-tight text-[var(--text-primary)] sm:text-[2rem]">
                  A clean preview of today’s strongest links
                </h2>
              </div>
              <Button onClick={handleStoriesAccess} size="sm" variant="ghost">
                View full feed
              </Button>
            </div>

            {loading ? (
              <SkeletonGrid count={3} />
            ) : (
              <div className="home-story-preview grid gap-4 xl:grid-cols-3">
                {stories.map((story) => (
                  <StoryCard
                    isAuthenticated={isAuthenticated}
                    isBookmarked={Boolean(user?.bookmarks?.includes(story._id))}
                    isBookmarkPending={bookmarkPendingId === story._id}
                    key={story._id}
                    onBookmark={handleBookmark}
                    onCopy={() =>
                      pushToast({
                        title: "Link copied",
                        description: "Story URL copied to your clipboard.",
                        variant: "success",
                      })
                    }
                    story={story}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="space-y-4">
            {featureCards.map((feature) => (
              <motion.div
                className="glass-panel rounded-[30px] border border-[var(--border)] p-6"
                key={feature.title}
                whileHover={{ y: -4 }}
              >
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--accent)]">
                  <feature.icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-xl font-semibold text-[var(--text-primary)]">
                  {feature.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[var(--text-secondary)]">
                  {feature.copy}
                </p>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default Home;
