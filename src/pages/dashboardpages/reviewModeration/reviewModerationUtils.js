export const getReviewId = (review) => review?._id || review?.id || null;

export const getReviewStatus = (review) => {
  const status =
    review?.moderationStatus ||
    review?.status ||
    (review?.isHidden ? "hidden_by_admin" : "active");
  if (status === "hidden") return "hidden_by_admin";
  return status || "active";
};

export const isHiddenStatus = (status) =>
  ["hidden_by_admin", "hidden"].includes(String(status || "").toLowerCase());

export const formatDate = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString();
};

export const truncateText = (value, limit = 120) => {
  const text = String(value || "");
  if (text.length <= limit) return text;
  return `${text.slice(0, limit)}...`;
};

export const initialFilters = {
  search: "",
  moderationStatus: "all",
  minRating: "",
  maxRating: "",
};

export const initialPagination = { page: 1, limit: 20, total: 0, totalPages: 1 };
