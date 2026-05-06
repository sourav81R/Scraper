export const cn = (...values) => values.filter(Boolean).join(" ");

export const formatCompactNumber = (value = 0) =>
  new Intl.NumberFormat("en", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(value);

export const formatRelativeTime = (value) => {
  if (!value) {
    return "Moments ago";
  }

  if (typeof value === "string" && !value.includes("T")) {
    return value;
  }

  const targetDate = new Date(value);

  if (Number.isNaN(targetDate.getTime())) {
    return "Recently";
  }

  const diffMs = targetDate.getTime() - Date.now();
  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const units = [
    ["year", 1000 * 60 * 60 * 24 * 365],
    ["month", 1000 * 60 * 60 * 24 * 30],
    ["week", 1000 * 60 * 60 * 24 * 7],
    ["day", 1000 * 60 * 60 * 24],
    ["hour", 1000 * 60 * 60],
    ["minute", 1000 * 60],
  ];

  for (const [unit, unitMs] of units) {
    if (Math.abs(diffMs) >= unitMs || unit === "minute") {
      return formatter.format(Math.round(diffMs / unitMs), unit);
    }
  }

  return "Just now";
};

export const getStoryHref = (story) =>
  story.url || `https://news.ycombinator.com/item?id=${story.hnId}`;

export const serializeStoryQuery = (query) =>
  JSON.stringify({
    page: query.page || 1,
    limit: query.limit || 10,
    search: query.search || "",
    domain: query.domain || "",
    sortBy: query.sortBy || "points",
    order: query.order || "desc",
  });

export const copyText = async (value) => {
  await navigator.clipboard.writeText(value);
};

export const normalizeApiError = (error, fallbackMessage) =>
  error?.response?.data?.message || error?.message || fallbackMessage;
