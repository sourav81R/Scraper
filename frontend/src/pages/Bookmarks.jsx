import { useEffect, useState } from "react";
import { BookmarkCheck, Clock3 } from "lucide-react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import EmptyState from "../components/EmptyState";
import PageTransition from "../components/PageTransition";
import SkeletonGrid from "../components/SkeletonGrid";
import StatCard from "../components/StatCard";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/AuthContext";
import { useStories } from "../context/StoryContext";
import { useToast } from "../context/ToastContext";
import { formatRelativeTime, normalizeApiError } from "../lib/utils";

const Bookmarks = () => {
  const { user } = useAuth();
  const { fetchBookmarks, toggleBookmark } = useStories();
  const { pushToast } = useToast();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [bookmarkPendingId, setBookmarkPendingId] = useState("");

  useEffect(() => {
    let cancelled = false;

    const loadBookmarks = async () => {
      try {
        setLoading(true);
        const response = await fetchBookmarks();

        if (!cancelled) {
          setStories(response.data);
        }
      } catch (error) {
        if (!cancelled) {
          pushToast({
            title: "Unable to load bookmarks",
            description: normalizeApiError(error, "Please try again."),
            variant: "error",
          });
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadBookmarks();

    return () => {
      cancelled = true;
    };
  }, [fetchBookmarks, pushToast, user?.bookmarks]);

  const handleBookmark = async (storyId) => {
    try {
      setBookmarkPendingId(storyId);
      const response = await toggleBookmark(storyId);
      setStories((currentStories) =>
        currentStories.filter((story) => story._id !== storyId)
      );
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

  return (
    <PageTransition className="px-4 pb-16 pt-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <section className="glass-panel rounded-[36px] border border-[var(--border)] px-6 py-8 sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[var(--accent)]">
            Personal reading queue
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-[var(--text-primary)]">
            Keep the stories worth revisiting in one calm, searchable place.
          </h1>
          <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
            Your bookmark list stays lightweight and focused, making it easier to
            come back to deeper reads without losing your context.
          </p>
        </section>

        <section className="grid gap-4 md:grid-cols-2">
          <StatCard
            description="Stories currently saved in your queue"
            icon={BookmarkCheck}
            title="Saved stories"
            value={user?.bookmarks?.length || 0}
          />
          <StatCard
            description={
              stories[0]?.updatedAt
                ? formatRelativeTime(stories[0].updatedAt)
                : "No saved activity yet"
            }
            icon={Clock3}
            title="Latest bookmark activity"
            value={stories[0]?.title ? "Recently updated" : "No activity"}
          />
        </section>

        {loading ? <SkeletonGrid count={4} /> : null}

        {!loading && stories.length === 0 ? (
          <EmptyState
            action={
              <Button as={Link} to="/stories">
                Browse stories
              </Button>
            }
            description="Bookmark standout stories from the live feed and they will appear here instantly."
            title="Your bookmark list is empty"
          />
        ) : null}

        {!loading ? (
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <StoryCard
                isAuthenticated
                isBookmarked
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
        ) : null}
      </div>
    </PageTransition>
  );
};

export default Bookmarks;
