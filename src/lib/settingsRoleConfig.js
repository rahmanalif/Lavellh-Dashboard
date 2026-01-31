export const SETTINGS_ROLE_STORAGE_KEY = "settingsRole";

export const SETTINGS_ROLES = [
  { value: "user", label: "User" },
  { value: "provider", label: "Provider" },
  { value: "business-owner", label: "Business Owner" },
  { value: "event-manager", label: "Event Manager" },
];

export const DEFAULT_SETTINGS_ROLE = "user";

const ROLE_ENDPOINTS = {
  "business-owner": {
    privacy_policy: "/business-owners/privacy-policy",
    terms_and_conditions: "/business-owners/terms-and-conditions",
    faq: "/business-owners/faqs",
  },
  "event-manager": {
    privacy_policy: "/event-managers/privacy-policy",
    terms_and_conditions: "/event-managers/terms-and-conditions",
  },
};

export const resolveRoleSettingEndpoint = (role, key) => {
  if (role === "user" || role === "provider") {
    return `/settings/${key}`;
  }

  return ROLE_ENDPOINTS[role]?.[key] || null;
};

export const isRoleSettingSupported = (role, key) =>
  Boolean(resolveRoleSettingEndpoint(role, key));

export const isRoleSettingEditable = (role, key) => {
  if (!isRoleSettingSupported(role, key)) return false;
  return role === "user" || role === "provider";
};

export const getRoleLabel = (role) =>
  SETTINGS_ROLES.find((item) => item.value === role)?.label || role;
