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
