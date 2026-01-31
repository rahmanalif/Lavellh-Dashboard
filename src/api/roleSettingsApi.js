import client from "./client";
import { resolveRoleSettingEndpoint } from "../lib/settingsRoleConfig";

const extractData = (res) => res?.data?.data ?? res?.data;

export const fetchRoleSetting = async ({ role, key }) => {
  const endpoint = resolveRoleSettingEndpoint(role, key);
  if (!endpoint) return null;
  const res = await client.get(endpoint);
  const data = extractData(res);
  return data?.settings || data;
};
