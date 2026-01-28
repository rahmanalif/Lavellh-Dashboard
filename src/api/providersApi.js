import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchProviders = async ({
  page = 1,
  limit = 20,
  search = "",
  status,
} = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (status) params.status = status;
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

export const rejectProvider = async ({ id, reason }) => {
  const res = await adminClient.put(`/admin/providers/${id}/reject`, { reason });
  const data = extractData(res);
  return data?.provider || data?.data?.provider || data;
};

export const toggleProviderStatus = async (id) => {
  const res = await adminClient.put(`/admin/providers/${id}/toggle-status`);
  const data = extractData(res);
  return data?.provider || data?.data?.provider || data;
};

export const deleteProvider = async (id) => {
  const res = await adminClient.delete(`/admin/providers/${id}`);
  const data = extractData(res);
  return data?.provider || data?.data?.provider || data;
};
