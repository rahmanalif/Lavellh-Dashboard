import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchDashboardStats = async (year) => {
  const res = await adminClient.get("/admin/dashboard/stats", {
    params: { year },
  });
  return extractData(res);
};
