import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchProviders = async ({ page = 1, limit = 20, search = "" }) => {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await adminClient.get("/admin/providers", { params });
  return extractData(res);
};

export const fetchProviderById = async (id) => {
  const res = await adminClient.get(`/admin/providers/${id}`);
  const data = extractData(res);
  return data?.provider || data?.data?.provider || data;
};

export const approveProvider = async (id) => {
  const res = await adminClient.put(`/admin/providers/${id}/approve`);
  const data = extractData(res);
  return data?.provider || data?.data?.provider || data;
};

export const rejectProvider = async (id) => {
  const res = await adminClient.put(`/admin/providers/${id}/reject`);
  const data = extractData(res);
  return data?.provider || data?.data?.provider || data;
};
