import client from "./client";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchPublicSetting = async (key) => {
  const res = await client.get(`/settings/${key}`);
  const data = extractData(res);
  return data?.settings || data;
};
