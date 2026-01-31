"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchRoleSetting,
  selectRoleSetting,
  selectRoleSettingError,
  selectRoleSettingStatus,
} from "@/store/settingsSlice";
import { selectAdminPermissions } from "@/store/adminAuthSlice";
import SettingsRoleSelector from "@/components/dashboardcomponents/SettingsRoleSelector";
import { useSettingsRole } from "@/lib/useSettingsRole";
import {
  getRoleLabel,
  isRoleSettingEditable,
  isRoleSettingSupported,
} from "@/lib/settingsRoleConfig";

export function FAQSection() {
  const dispatch = useDispatch();
  const [role, setRole] = useSettingsRole();
  const setting = useSelector(selectRoleSetting(role, "faq"));
  const status = useSelector(selectRoleSettingStatus(role, "faq"));
  const error = useSelector(selectRoleSettingError(role, "faq"));
  const permissions = useSelector(selectAdminPermissions);
  const canManageSettings = permissions?.canManageSettings ?? true;
  const isSupported = isRoleSettingSupported(role, "faq");
  const isEditable = isRoleSettingEditable(role, "faq");

  useEffect(() => {
    if (!isSupported) return;
    if (status === "idle") {
      dispatch(fetchRoleSetting({ role, key: "faq" }));
    }
  }, [dispatch, isSupported, role, status]);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">FAQ</h2>
        <div className="flex flex-wrap items-center gap-3">
          <SettingsRoleSelector value={role} onChange={setRole} />
          {canManageSettings && isSupported && isEditable && (
            <Link to="/dashboard/settings/editfaq">
              <Button className="bg-[#1C5941] hover:bg-[#1C5941] text-white rounded-full flex items-center space-x-1 shadow-md">
                <Edit className="h-4 w-4" />
                <span>Edit</span>
              </Button>
            </Link>
          )}
        </div>
      </div>

      {!isSupported && (
        <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3 mb-4">
          FAQ is not available for {getRoleLabel(role)}.
        </p>
      )}
      {status === "loading" && (
        <p className="text-gray-500">Loading FAQ...</p>
      )}
      {status === "failed" && (
        <p className="text-red-500">{error || "Failed to load FAQ."}</p>
      )}
      {status === "succeeded" && (
        <div
          className="text-gray-700 leading-relaxed [&_p]:mb-4"
          dangerouslySetInnerHTML={{
            __html: setting?.content || "<p>No content available.</p>",
          }}
        />
      )}
    </div>
  );
}
