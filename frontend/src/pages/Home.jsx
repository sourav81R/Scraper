import { useEffect, useState } from "react";
import api from "../api/axios";
import StoryCard from "../components/StoryCard";
import { useAuth } from "../context/AuthContext";

const Home = () => {
  const { isAuthenticated, updateBookmarks, user } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [bookmarkIds, setBookmarkIds] = useState(user?.bookmarks || []);
  const [bookmarkPendingId, setBookmarkPendingId] = useState("");

  useEffect(() => {
    setBookmarkIds(user?.bookmarks || []);
  }, [user]);

  useEffect(() => {
    const fetchStories = async () => {
      try {
        setLoading(true);
        setError("");

        const { data } = await api.get("/api/stories", {
          params: { page, limit: 10 },
        });

        setStories(data.data);
        setTotalPages(data.totalPages || 1);
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Unable to load stories right now"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchStories();
  }, [page]);

  const handleBookmark = async (storyId) => {
    try {
      setBookmarkPendingId(storyId);
      const { data } = await api.post(`/api/stories/${storyId}/bookmark`);
      const nextBookmarks = Array.isArray(data.data) ? data.data : [];

      setBookmarkIds(nextBookmarks);
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
      <div className="page-hero">
        <p className="eyebrow">Top Hacker News</p>
        <h1>Track the stories people cannot stop talking about.</h1>
        <p className="page-copy">
          Freshly scraped headlines, sorted by score, with simple bookmarking for
          your reading queue.
        </p>
      </div>

      {error ? <p className="status-card error">{error}</p> : null}
      {loading ? <p className="status-card">Loading stories...</p> : null}

      {!loading ? (
        <>
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

          {stories.length === 0 ? (
            <p className="status-card">No stories available yet. Trigger a scrape to begin.</p>
          ) : null}

          <div className="pagination">
            <button
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              type="button"
            >
              Previous
            </button>
            <span>
              Page {page} of {totalPages}
            </span>
            <button
              disabled={page >= totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              type="button"
            >
              Next
            </button>
          </div>
        </>
      ) : null}
    </section>
  );
};

export default Home;
