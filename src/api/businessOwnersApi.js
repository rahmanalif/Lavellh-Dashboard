import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchBusinessOwners = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await adminClient.get("/admin/business-owners", { params });
  return extractData(res);
};

export const fetchBusinessOwnerById = async (id) => {
  const res = await adminClient.get(`/admin/business-owners/${id}`);
  const data = extractData(res);
  return data?.businessOwner || data?.owner || data?.data?.businessOwner || data;
};

export const toggleBusinessOwnerStatus = async (id) => {
  const res = await adminClient.put(`/admin/business-owners/${id}/toggle-status`);
  const data = extractData(res);
  return data?.businessOwner || data?.owner || data?.data?.businessOwner || data;
};
