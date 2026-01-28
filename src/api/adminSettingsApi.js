import adminClient from "./adminClient";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchAdminSettings = async () => {
  const res = await adminClient.get("/admin/settings");
  const data = extractData(res);
  return data?.settings || data;
};

export const fetchAdminSetting = async (key) => {
  const res = await adminClient.get(`/admin/settings/${key}`);
  const data = extractData(res);
  return data?.settings || data;
};

export const upsertAdminSetting = async ({ key, title, content }) => {
  const res = await adminClient.put(`/admin/settings/${key}`, {
    title,
    content,
  });
  const data = extractData(res);
  return data?.settings || data;
};
