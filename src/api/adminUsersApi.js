import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchAdmins = async ({ page = 1, limit = 20, search = "" } = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await adminClient.get("/admin/admins", { params });
  return extractData(res);
};

export const fetchAdminById = async (id) => {
  const res = await adminClient.get(`/admin/admins/${id}`);
  const data = extractData(res);
  return data?.admin || data?.user || data;
};

export const createAdmin = async (payload) => {
  const res = await adminClient.post("/admin/admins", payload);
  const data = extractData(res);
  return data?.admin || data?.user || data;
};

export const updateAdmin = async (id, payload) => {
  const res = await adminClient.put(`/admin/admins/${id}`, payload);
  const data = extractData(res);
  return data?.admin || data?.user || data;
};

export const toggleAdminStatus = async (id) => {
  const res = await adminClient.put(`/admin/admins/${id}/toggle-status`);
  const data = extractData(res);
  return data?.admin || data?.user || data;
};

export const deleteAdmin = async (id) => {
  const res = await adminClient.delete(`/admin/admins/${id}`);
  const data = extractData(res);
  return data?.admin || data?.user || data;
};
