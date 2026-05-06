import { useNavigate } from "react-router-dom";

const StoryCard = ({
  story,
  isBookmarked,
  onBookmark,
  isAuthenticated,
  bookmarkPending = false,
}) => {
  const navigate = useNavigate();

  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await onBookmark(story._id);
  };

  return (
    <article className="story-card">
      <div className="story-card__top">
        <span className="points-badge">{story.points} pts</span>
        <button
          className={`bookmark-button ${isBookmarked ? "active" : ""}`}
          disabled={bookmarkPending}
          onClick={handleBookmarkClick}
          type="button"
        >
          {isBookmarked ? "★" : "☆"}
        </button>
      </div>
      <a
        className="story-link"
        href={story.url || `https://news.ycombinator.com/item?id=${story.hnId}`}
        rel="noreferrer"
        target="_blank"
      >
        {story.title}
      </a>
      <div className="story-meta">
        <span>by {story.author || "unknown"}</span>
        <span>{story.postedAt || "time unavailable"}</span>
      </div>
    </article>
  );
};

export default StoryCard;
