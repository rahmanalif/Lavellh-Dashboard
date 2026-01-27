import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchTransactions = async ({
  page = 1,
  limit = 20,
  type = "all",
  status,
  search,
  from,
  to,
} = {}) => {
  const params = { page, limit, type };
  if (status) params.status = status;
  if (search) params.search = search;
  if (from) params.from = from;
  if (to) params.to = to;
  const res = await adminClient.get("/admin/transactions", { params });
  return extractData(res);
};
