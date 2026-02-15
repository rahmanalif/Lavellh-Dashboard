import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const broadcastNotification = async (payload) => {
  const res = await adminClient.post("/admin/notifications/broadcast", payload);
  return extractData(res);
};
