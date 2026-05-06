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
import { serializeStoryQuery } from "../lib/utils";

const StoryContext = createContext(null);

export const StoryProvider = ({ children }) => {
  const { updateBookmarks, user } = useAuth();
  const cacheRef = useRef(new Map());
  const [stats, setStats] = useState(null);
  const [scrapeStatus, setScrapeStatus] = useState(null);

  const invalidateStories = useCallback(() => {
    cacheRef.current.clear();
  }, []);

  const fetchStories = useCallback(async (query, { force = false } = {}) => {
    const cacheKey = serializeStoryQuery(query);

    if (!force && cacheRef.current.has(cacheKey)) {
      return cacheRef.current.get(cacheKey);
    }

    const response = await storiesApi.list(query);
    cacheRef.current.set(cacheKey, response);
    return response;
  }, []);

  const fetchStats = useCallback(
    async ({ force = false } = {}) => {
      if (stats && !force) {
        return { data: stats };
      }

      const response = await storiesApi.stats();
      setStats(response.data);
      return response;
    },
    [stats]
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
    [scrapeStatus]
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
