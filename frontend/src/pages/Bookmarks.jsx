import { useEffect, useState } from "react";
import api from "../api/axios";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/AuthContext";

const Bookmarks = () => {
  const { isAuthenticated, updateBookmarks, user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkPendingId, setBookmarkPendingId] = useState("");
  const bookmarkIds = user?.bookmarks || [];

  useEffect(() => {
    const fetchBookmarkedStories = async () => {
      try {
        setLoading(true);
        setError("");

        if (bookmarkIds.length === 0) {
          setStories([]);
          return;
        }

        const { data } = await api.get("/api/stories", {
          params: { page: 1, limit: 100 },
        });

        setStories(
          data.data.filter((story) => bookmarkIds.includes(story._id))
        );
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load bookmarks right now"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarkedStories();
  }, [bookmarkIds]);

  const handleBookmark = async (storyId) => {
    try {
      setBookmarkPendingId(storyId);
      const { data } = await api.post(`/api/stories/${storyId}/bookmark`);
      const nextBookmarks = Array.isArray(data.data) ? data.data : [];
      updateBookmarks(nextBookmarks);
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Unable to update bookmark right now"
      );
    } finally {
      setBookmarkPendingId("");
    }
  };

  return (
    <section className="page-shell">
      <div className="page-hero compact">
        <p className="eyebrow">Your reading list</p>
        <h1>Bookmarks</h1>
        <p className="page-copy">
          Stories you flagged for later live here until you clear them out.
        </p>
      </div>

      {error ? <p className="status-card error">{error}</p> : null}
      {loading ? <p className="status-card">Loading bookmarks...</p> : null}

      {!loading && stories.length === 0 ? (
        <p className="status-card">No bookmarks yet. Save a story from the home page.</p>
      ) : null}

      {!loading ? (
        <div className="story-grid">
          {stories.map((story) => (
            <StoryCard
              bookmarkPending={bookmarkPendingId === story._id}
              isAuthenticated={isAuthenticated}
              isBookmarked={bookmarkIds.includes(story._id)}
              key={story._id}
              onBookmark={handleBookmark}
              story={story}
            />
          ))}
        </div>
      ) : null}
    </section>
  );
};

export default Bookmarks;
