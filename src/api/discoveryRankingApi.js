import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

/**
 * @typedef {Object} ProviderRankingItem
 * @property {string} providerId
 * @property {string} name
 * @property {string=} profileImage
 * @property {boolean=} isUserActive
 * @property {string=} verificationStatus
 * @property {boolean=} isAvailable
 * @property {number=} pinOrder
 * @property {string=} pinnedAt
 */

/**
 * @typedef {Object} BusinessRankingItem
 * @property {string} businessOwnerId
 * @property {string} businessName
 * @property {string=} businessPhoto
 * @property {string=} businessAddress
 * @property {boolean=} isUserActive
 * @property {number=} pinOrder
 * @property {string=} pinnedAt
 */

const parseRankingArray = (value) =>
  Array.isArray(value)
    ? value
    : Array.isArray(value?.items)
    ? value.items
    : Array.isArray(value?.results)
    ? value.results
    : [];

/**
 * @returns {Promise<ProviderRankingItem[]>}
 */
export const fetchProviderRanking = async () => {
  const res = await adminClient.get("/admin/discovery/providers/ranking");
  const data = extractData(res);
  return parseRankingArray(data);
};

/**
 * @param {string[]} orderedIds
 */
export const updateProviderRanking = async (orderedIds) => {
  const res = await adminClient.put("/admin/discovery/providers/ranking", {
    orderedIds,
  });
  return extractData(res);
};

/**
 * @returns {Promise<BusinessRankingItem[]>}
 */
export const fetchBusinessRanking = async () => {
  const res = await adminClient.get("/admin/discovery/businesses/ranking");
  const data = extractData(res);
  return parseRankingArray(data);
};

/**
 * @param {string[]} orderedIds
 */
export const updateBusinessRanking = async (orderedIds) => {
  const res = await adminClient.put("/admin/discovery/businesses/ranking", {
    orderedIds,
  });
  return extractData(res);
};

const parseCollection = (data, keys) => {
  for (const key of keys) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data)) return data;
  return [];
};

const parseTotalPages = (data) =>
  Number(data?.totalPages || data?.meta?.totalPages || 1);

export const fetchAllProviders = async () => {
  let page = 1;
  let totalPages = 1;
  const collected = [];
  do {
    const res = await adminClient.get("/admin/providers", {
      params: { page, limit: 100 },
    });
    const data = extractData(res);
    collected.push(...parseCollection(data, ["providers"]));
    totalPages = parseTotalPages(data);
    page += 1;
  } while (page <= totalPages);
  return collected;
};

export const fetchAllBusinessOwners = async () => {
  let page = 1;
  let totalPages = 1;
  const collected = [];
  do {
    const res = await adminClient.get("/admin/business-owners", {
      params: { page, limit: 100 },
    });
    const data = extractData(res);
    collected.push(...parseCollection(data, ["businessOwners", "owners"]));
    totalPages = parseTotalPages(data);
    page += 1;
  } while (page <= totalPages);
  return collected;
};

export const fetchProviderAvailablePage = async ({
  page = 1,
  limit = 20,
  search = "",
  status = "verified",
} = {}) => {
  const params = { page, limit, status };
  if (search) params.search = search;
  const res = await adminClient.get("/admin/providers", { params });
  const data = extractData(res);
  return {
    items: parseCollection(data, ["providers"]),
    totalPages: parseTotalPages(data),
    currentPage: Number(data?.currentPage || page),
  };
};

export const fetchBusinessAvailablePage = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await adminClient.get("/admin/business-owners", { params });
  const data = extractData(res);
  return {
    items: parseCollection(data, ["businessOwners", "owners"]),
    totalPages: parseTotalPages(data),
    currentPage: Number(data?.currentPage || page),
  };
};
