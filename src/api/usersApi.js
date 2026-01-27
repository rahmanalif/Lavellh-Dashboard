import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchUsers = async ({ page = 1, limit = 20, search = "" }) => {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await adminClient.get("/admin/users", { params });
  return extractData(res);
};

export const fetchUserById = async (id) => {
  const res = await adminClient.get(`/admin/users/${id}`);
  const data = extractData(res);
  return data?.user || data?.data?.user || data;
};

export const deleteUser = async (id) => {
  const res = await adminClient.delete(`/admin/users/${id}`);
  return extractData(res);
};
