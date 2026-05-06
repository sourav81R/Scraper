const buildPagination = ({ page = 1, limit = 10, total = 0 }) => {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return {
    page,
    limit,
    total,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

module.exports = { buildPagination };
