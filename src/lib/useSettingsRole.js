import { useEffect, useState } from "react";
import {
  DEFAULT_SETTINGS_ROLE,
  SETTINGS_ROLE_STORAGE_KEY,
  SETTINGS_ROLES,
} from "./settingsRoleConfig";

const isValidRole = (role) =>
  SETTINGS_ROLES.some((item) => item.value === role);

export const useSettingsRole = () => {
  const [role, setRole] = useState(() => {
    if (typeof window === "undefined") {
      return DEFAULT_SETTINGS_ROLE;
    }
    const stored = window.localStorage.getItem(SETTINGS_ROLE_STORAGE_KEY);
    return isValidRole(stored) ? stored : DEFAULT_SETTINGS_ROLE;
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(SETTINGS_ROLE_STORAGE_KEY, role);
  }, [role]);

  return [role, setRole];
};
