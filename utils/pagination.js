export function calculatePagination(total, page, pageSize) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const skip = (safePage - 1) * pageSize;

  return {
    totalPages,
    safePage,
    skip,
  };
}

export function getVisibleRange(page, pageSize, total) {
  const safeTotal = Number.isFinite(total) ? total : 0;
  const start = safeTotal === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, safeTotal);
  return { start, end };
}
