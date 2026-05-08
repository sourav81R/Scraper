import { useDeferredValue, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Clock3, RefreshCw, Sparkles, TrendingUp } from "lucide-react";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import StatCard from "../components/StatCard";
import StoryCard from "../components/StoryCard";
import StoryFilters from "../components/StoryFilters";
import { useAuth } from "../context/AuthContext";
import { useStories } from "../context/StoryContext";
import { useToast } from "../context/ToastContext";
import {
  formatCompactNumber,
  formatRelativeTime,
  normalizeApiError,
} from "../lib/utils";

const defaultFilters = {
  page: 1,
  limit: 9,
  search: "",
  domain: "",
  sortBy: "points",
  order: "desc",
};

const Stories = () => {
  const { isAuthenticated, user } = useAuth();
  const {
    fetchStories,
    peekStories,
    scrapeStatus: cachedScrapeStatus,
    stats: cachedStats,
    toggleBookmark,
    triggerScrape,
  } = useStories();
  const { pushToast } = useToast();
  const [filters, setFilters] = useState(defaultFilters);
  const initialStoryResponse = peekStories(defaultFilters);
  const [stories, setStories] = useState(() => initialStoryResponse?.data || []);
  const [stats, setStats] = useState(
    () => initialStoryResponse?.meta?.stats || cachedStats
  );
  const [pagination, setPagination] = useState(
    () => initialStoryResponse?.meta?.pagination || null
  );
  const [domainOptions, setDomainOptions] = useState(
    () => initialStoryResponse?.meta?.filters?.availableDomains || []
  );
  const [loading, setLoading] = useState(() => !initialStoryResponse);
  const [refreshing, setRefreshing] = useState(false);
  const [bookmarkPendingId, setBookmarkPendingId] = useState("");
  const [scrapeStatus, setScrapeStatus] = useState(
    () => initialStoryResponse?.meta?.scrapeStatus || cachedScrapeStatus
  );
  const deferredSearch = useDeferredValue(filters.search);

  useEffect(() => {
    let cancelled = false;

    const loadStoryPage = async () => {
      const query = { ...filters, search: deferredSearch };
      const cachedStoriesResponse = peekStories(query);

      try {
        if (cachedStoriesResponse) {
          setStories(cachedStoriesResponse.data);
          setPagination(cachedStoriesResponse.meta.pagination);
          setDomainOptions(cachedStoriesResponse.meta.filters.availableDomains);
          setStats(cachedStoriesResponse.meta.stats || cachedStats);
          setScrapeStatus(
            cachedStoriesResponse.meta.scrapeStatus || cachedScrapeStatus
          );
          setLoading(false);
        } else {
          setLoading(true);
        }

        const storiesResponse = await fetchStories(query, {
          force: Boolean(cachedStoriesResponse),
        });

        if (!cancelled) {
          setStories(storiesResponse.data);
          setPagination(storiesResponse.meta.pagination);
          setDomainOptions(storiesResponse.meta.filters.availableDomains);
          setStats(storiesResponse.meta.stats || cachedStats);
          setScrapeStatus(
            storiesResponse.meta.scrapeStatus || cachedScrapeStatus
          );
        }
      } catch (error) {
        if (!cancelled) {
          pushToast({
            title: cachedStoriesResponse
              ? "Showing saved stories"
              : "Unable to load stories",
            description: cachedStoriesResponse
              ? "The latest refresh failed, so the last loaded stories are still on screen."
              : normalizeApiError(error, "Please try again."),
            variant: cachedStoriesResponse ? "warning" : "error",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadStoryPage();

    return () => {
      cancelled = true;
    };
  }, [
    deferredSearch,
    fetchStories,
    filters,
    peekStories,
    pushToast,
    cachedScrapeStatus,
    cachedStats,
  ]);

  const handleBookmark = async (storyId) => {
    try {
      setBookmarkPendingId(storyId);
      const response = await toggleBookmark(storyId);
      pushToast({
        title: response.data.bookmarked ? "Bookmark added" : "Bookmark removed",
        description: response.message,
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "Unable to update bookmark",
        description: normalizeApiError(error, "Please try again."),
        variant: "error",
      });
    } finally {
      setBookmarkPendingId("");
    }
  };

  const handleManualScrape = async () => {
    try {
      setRefreshing(true);
      const response = await triggerScrape();
      const refreshedStories = await fetchStories(
        { ...filters, search: deferredSearch },
        { force: true }
      );

      setStories(refreshedStories.data);
      setPagination(refreshedStories.meta.pagination);
      setDomainOptions(refreshedStories.meta.filters.availableDomains);
      setStats(refreshedStories.meta.stats || null);
      setScrapeStatus(refreshedStories.meta.scrapeStatus || null);

      pushToast({
        title: "Stories refreshed",
        description: response.message,
        variant: "success",
      });
    } catch (error) {
      pushToast({
        title: "Scrape failed",
        description: normalizeApiError(error, "Please try again."),
        variant: "error",
      });
    } finally {
      setRefreshing(false);
    }
  };

  return (
    <PageTransition className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="grid gap-4 xl:grid-cols-4">
          <StatCard
            description="Scraped from the live feed"
            icon={TrendingUp}
            title="Tracked stories"
            value={stats?.totalStories || 0}
          />
          <StatCard
            description="Stories saved by readers"
            icon={Sparkles}
            title="Bookmarks"
            value={stats?.totalBookmarks || 0}
          />
          <StatCard
            description="Current average conversation load"
            icon={RefreshCw}
            title="Average comments"
            value={stats?.avgComments || 0}
          />
          <StatCard
            description={
              scrapeStatus?.finishedAt
                ? formatRelativeTime(scrapeStatus.finishedAt)
                : "Waiting for the first sync"
            }
            icon={Clock3}
            title="Last successful scrape"
            value={
              scrapeStatus?.itemsProcessed
                ? `${formatCompactNumber(scrapeStatus.itemsProcessed)} items`
                : "Not yet"
            }
          />
        </section>

        <section className="glass-panel rounded-[36px] border border-[var(--border)] px-6 py-8 sm:px-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
                Story feed
              </p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
                Browse, filter, and save the strongest Hacker News links.
              </h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                Use search, domain filters, and alternate sorting to move from noise
                to signal quickly, then bookmark stories into a persistent queue.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={handleManualScrape} variant="secondary">
                {refreshing ? "Refreshing…" : "Run manual scrape"}
              </Button>
              <Button as="a" href="https://news.ycombinator.com" rel="noreferrer" target="_blank">
                Open Hacker News
              </Button>
            </div>
          </div>
        </section>

        <StoryFilters
          availableDomains={domainOptions}
          domain={filters.domain}
          onClear={() =>
            setFilters(defaultFilters)
          }
          onDomainChange={(value) =>
            setFilters((current) => ({ ...current, domain: value, page: 1 }))
          }
          onOrderChange={(value) =>
            setFilters((current) => ({ ...current, order: value, page: 1 }))
          }
          onRefresh={handleManualScrape}
          onSearchChange={(value) =>
            setFilters((current) => ({ ...current, search: value, page: 1 }))
          }
          onSortChange={(value) =>
            setFilters((current) => ({ ...current, sortBy: value, page: 1 }))
          }
          order={filters.order}
          refreshing={refreshing}
          search={filters.search}
          sortBy={filters.sortBy}
        />

        {loading ? <SkeletonGrid count={6} /> : null}

        {!loading && stories.length === 0 ? (
          <EmptyState
            action={<Button onClick={handleManualScrape}>Run scraper now</Button>}
            description="Try a broader search or refresh the feed to pull in the latest top stories."
            title="No stories matched your current filters"
          />
        ) : null}

        {!loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story, index) => (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                initial={{ opacity: 0, y: 14 }}
                key={story._id}
                transition={{ delay: index * 0.03 }}
              >
                <StoryCard
                  isAuthenticated={isAuthenticated}
                  isBookmarked={Boolean(user?.bookmarks?.includes(story._id))}
                  isBookmarkPending={bookmarkPendingId === story._id}
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
              </motion.div>
            ))}
          </div>
        ) : null}

        {pagination ? (
          <div className="glass-panel flex flex-col gap-4 rounded-[28px] border border-[var(--border)] px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-sm text-[var(--text-secondary)]">
              Page {pagination.page} of {pagination.totalPages}
            </p>
            <div className="flex gap-3">
              <Button
                disabled={!pagination.hasPreviousPage}
                onClick={() =>
                  setFilters((current) => ({ ...current, page: current.page - 1 }))
                }
                variant="secondary"
              >
                Previous
              </Button>
              <Button
                disabled={!pagination.hasNextPage}
                onClick={() =>
                  setFilters((current) => ({ ...current, page: current.page + 1 }))
                }
              >
                Next
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </PageTransition>
  );
};

export default Stories;
