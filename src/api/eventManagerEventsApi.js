import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchEventsByManager = async ({
  managerId,
  page = 1,
  limit = 20,
  search = "",
  status,
}) => {
  const params = { page, limit };
  if (search) params.search = search;
  if (status) params.status = status;
  const res = await adminClient.get(`/admin/event-managers/${managerId}/events`, {
    params,
  });
  return extractData(res);
};
