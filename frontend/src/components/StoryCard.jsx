import { ArrowUpRight, MessageCircle, Star } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { formatRelativeTime, getStoryHref } from "../lib/utils";

const StoryCard = ({
  story,
  isBookmarked,
  onBookmark,
  isAuthenticated,
  isBookmarkPending = false,
}) => {
  const navigate = useNavigate();
  const storyHref = getStoryHref(story);
  const storyTimestamp = formatRelativeTime(story.postedAt || story.scrapedAt);

  const handleBookmarkClick = async () => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    await onBookmark(story._id);
  };

  return (
    <article className="story-card">
      <div className="story-card__glow" />
      <div className="story-card__top">
        <span className="points-badge">{story.points} pts</span>
        <button
          aria-label={isBookmarked ? "Remove bookmark" : "Add bookmark"}
          className={`bookmark-button ${isBookmarked ? "active" : ""}`}
          disabled={isBookmarkPending}
          onClick={handleBookmarkClick}
          type="button"
        >
          <Star className="h-4 w-4" fill={isBookmarked ? "currentColor" : "none"} />
        </button>
      </div>

      <div className="story-card__body">
        <a className="story-link" href={storyHref} rel="noreferrer" target="_blank">
          <span>{story.title}</span>
          <ArrowUpRight className="story-link__icon" />
        </a>

        <div className="story-meta">
          <div className="story-meta__row">
            <div className="story-meta__group">
              <span className="story-meta__label">Author</span>
              <span className="story-meta__value">{story.author || "unknown"}</span>
            </div>
            <div className="story-meta__group">
              <span className="story-meta__label">Published</span>
              <span className="story-meta__value">{storyTimestamp}</span>
            </div>
          </div>

          <div className="story-card__footer">
            <span className="story-domain">{story.domain || "news.ycombinator.com"}</span>
            <span className="story-comments">
              <MessageCircle className="h-3.5 w-3.5" />
              {story.commentsCount || 0} comments
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};

export default StoryCard;
