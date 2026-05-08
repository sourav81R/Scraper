import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
} from "react";
import { scrapeApi, storiesApi } from "../api/services";
import { useAuth } from "./AuthContext";
import {
  readSessionCache,
  removeSessionCache,
  serializeStoryQuery,
  writeSessionCache,
} from "../lib/utils";

const StoryContext = createContext(null);
const STORIES_CACHE_KEY = "hn-tracker-story-cache";
const STATS_CACHE_KEY = "hn-tracker-stats-cache";
const SCRAPE_STATUS_CACHE_KEY = "hn-tracker-scrape-status-cache";

const readStoryResponseCache = () => {
  const storedCache = readSessionCache(STORIES_CACHE_KEY, {});

  if (!storedCache || typeof storedCache !== "object") {
    return new Map();
  }

  return new Map(Object.entries(storedCache));
};

export const StoryProvider = ({ children }) => {
  const { updateBookmarks, user } = useAuth();
  const cacheRef = useRef(readStoryResponseCache());
  const [stats, setStatsState] = useState(() =>
    readSessionCache(STATS_CACHE_KEY, null)
  );
  const [scrapeStatus, setScrapeStatusState] = useState(() =>
    readSessionCache(SCRAPE_STATUS_CACHE_KEY, null)
  );

  const persistStoryCache = useCallback(() => {
    writeSessionCache(STORIES_CACHE_KEY, Object.fromEntries(cacheRef.current));
  }, []);

  const setStats = useCallback((nextStats) => {
    setStatsState(nextStats);
    writeSessionCache(STATS_CACHE_KEY, nextStats);
  }, []);

  const setScrapeStatus = useCallback((nextStatus) => {
    setScrapeStatusState(nextStatus);
    writeSessionCache(SCRAPE_STATUS_CACHE_KEY, nextStatus);
  }, []);

  const invalidateStories = useCallback(() => {
    cacheRef.current.clear();
    removeSessionCache(STORIES_CACHE_KEY);
  }, []);

  const peekStories = useCallback((query) => {
    const cacheKey = serializeStoryQuery(query);
    return cacheRef.current.get(cacheKey) || null;
  }, []);

  const fetchStories = useCallback(async (query, { force = false } = {}) => {
    const cacheKey = serializeStoryQuery(query);

    if (!force && cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }

    const response = await storiesApi.list(query);
    cacheRef.current.set(cacheKey, response);
    if (response.meta?.stats) {
      setStats(response.meta.stats);
    }
    if (response.meta?.scrapeStatus) {
      setScrapeStatus(response.meta.scrapeStatus);
    }
    persistStoryCache();
    return response;
  }, [persistStoryCache, setScrapeStatus, setStats]);

  const fetchStats = useCallback(
    async ({ force = false } = {}) => {
      if (stats && !force) {
        return { data: stats };
      }

      const response = await storiesApi.stats();
      setStats(response.data);
      return response;
    },
    [setStats, stats]
  );

  const fetchScrapeStatus = useCallback(
    async ({ force = false } = {}) => {
      if (scrapeStatus && !force) {
        return { data: scrapeStatus };
      }

      const response = await scrapeApi.status();
      setScrapeStatus(response.data);
      return response;
    },
    [scrapeStatus, setScrapeStatus]
  );

  const fetchBookmarks = useCallback(async () => storiesApi.bookmarks(), []);

  const toggleBookmark = useCallback(
    async (storyId) => {
      const previousBookmarks = user?.bookmarks || [];
      const optimisticBookmarks = previousBookmarks.includes(storyId)
        ? previousBookmarks.filter((bookmarkId) => bookmarkId !== storyId)
        : [...previousBookmarks, storyId];

      updateBookmarks(optimisticBookmarks);

      try {
        const response = await storiesApi.toggleBookmark(storyId);
        updateBookmarks(response.data.bookmarks);
        return response;
      } catch (error) {
        updateBookmarks(previousBookmarks);
        throw error;
      }
    },
    [updateBookmarks, user]
  );

  const triggerScrape = useCallback(async () => {
    const response = await scrapeApi.trigger();
    invalidateStories();
    await Promise.all([
      fetchStats({ force: true }),
      fetchScrapeStatus({ force: true }),
    ]);
    return response;
  }, [fetchScrapeStatus, fetchStats, invalidateStories]);

  const value = useMemo(
    () => ({
      fetchBookmarks,
      peekStories,
      fetchScrapeStatus,
      fetchStats,
      fetchStories,
      invalidateStories,
      scrapeStatus,
      stats,
      toggleBookmark,
      triggerScrape,
    }),
    [
      fetchBookmarks,
      peekStories,
      fetchScrapeStatus,
      fetchStats,
      fetchStories,
      invalidateStories,
      scrapeStatus,
      stats,
      toggleBookmark,
      triggerScrape,
    ]
  );

  return <StoryContext.Provider value={value}>{children}</StoryContext.Provider>;
};

export const useStories = () => useContext(StoryContext);
