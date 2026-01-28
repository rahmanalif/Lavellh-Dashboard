import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchEventManagers = async ({
  page = 1,
  limit = 20,
  search = "",
} = {}) => {
  const params = { page, limit };
  if (search) params.search = search;
  const res = await adminClient.get("/admin/event-managers", { params });
  return extractData(res);
};

export const fetchEventManagerById = async (id) => {
  const res = await adminClient.get(`/admin/event-managers/${id}`);
  const data = extractData(res);
  return data?.eventManager || data?.manager || data;
};

export const toggleEventManagerStatus = async (id) => {
  const res = await adminClient.put(`/admin/event-managers/${id}/toggle-status`);
  const data = extractData(res);
  return data?.eventManager || data?.manager || data;
};

export const deleteEventManager = async (id) => {
  const res = await adminClient.delete(`/admin/event-managers/${id}`);
  const data = extractData(res);
  return data?.eventManager || data?.manager || data;
};
