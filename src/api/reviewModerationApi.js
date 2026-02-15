import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

const cleanParams = (params) => {
  const next = {};
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    next[key] = value;
  });
  return next;
};

export const fetchProviderReviews = async ({
  page = 1,
  limit = 20,
  search = "",
  moderationStatus = "all",
  minRating = "",
  maxRating = "",
} = {}) => {
  const params = cleanParams({
    page,
    limit,
    search,
    moderationStatus: moderationStatus === "all" ? undefined : moderationStatus,
    minRating,
    maxRating,
  });
  const res = await adminClient.get("/admin/reviews/providers", { params });
  return extractData(res);
};

export const hideProviderReview = async (id, reason) => {
  const res = await adminClient.patch(`/admin/reviews/providers/${id}/hide`, {
    reason,
  });
  return extractData(res);
};

export const restoreProviderReview = async (id) => {
  const res = await adminClient.patch(`/admin/reviews/providers/${id}/restore`);
  return extractData(res);
};

export const fetchBusinessReviews = async ({
  page = 1,
  limit = 20,
  search = "",
  moderationStatus = "all",
} = {}) => {
  const params = cleanParams({
    page,
    limit,
    search,
    moderationStatus: moderationStatus === "all" ? undefined : moderationStatus,
  });
  const res = await adminClient.get("/admin/reviews/businesses", { params });
  return extractData(res);
};

export const hideBusinessReview = async ({ id, sourceType, reason }) => {
  const res = await adminClient.patch(
    `/admin/reviews/businesses/${sourceType}/${id}/hide`,
    { reason }
  );
  return extractData(res);
};

export const restoreBusinessReview = async ({ id, sourceType }) => {
  const res = await adminClient.patch(
    `/admin/reviews/businesses/${sourceType}/${id}/restore`
  );
  return extractData(res);
};
