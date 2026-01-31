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

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const [role, setRole] = useSettingsRole();
  const setting = useSelector(selectRoleSetting(role, "privacy_policy"));
  const status = useSelector(selectRoleSettingStatus(role, "privacy_policy"));
  const error = useSelector(selectRoleSettingError(role, "privacy_policy"));
  const permissions = useSelector(selectAdminPermissions);
  const canManageSettings = permissions?.canManageSettings ?? true;
  const isSupported = isRoleSettingSupported(role, "privacy_policy");
  const isEditable = isRoleSettingEditable(role, "privacy_policy");

  useEffect(() => {
    if (!isSupported) return;
    if (status === "idle") {
      dispatch(fetchRoleSetting({ role, key: "privacy_policy" }));
    }
  }, [dispatch, isSupported, role, status]);

  return (
    <div className="font-sans pr-5">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
        <h2 className="text-xl sm:text-2xl font-bold text-white bg-[#1C5941] p-5 rounded-lg">
          Privacy Policy
        </h2>
        <SettingsRoleSelector value={role} onChange={setRole} />
      </div>

      {/* Edit Button */}
      {canManageSettings && isSupported && isEditable && (
        <div className="flex justify-end p-4">
          <Link to="/dashboard/settings/editprivacy">
            <Button className="bg-[#1C5941] hover:bg-[#1C5941] text-white rounded-full flex items-center space-x-1 shadow-md">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </Link>
        </div>
      )}

      {/* Content */}
      <div className="px-3">
        {!isSupported && (
          <p className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
            Privacy policy is not available for {getRoleLabel(role)}.
          </p>
        )}
        {status === "loading" && (
          <p className="text-gray-500">Loading privacy policy...</p>
        )}
        {status === "failed" && (
          <p className="text-red-500">{error || "Failed to load content."}</p>
        )}
        {status === "succeeded" && (
          <div
            className="text-gray-700 leading-relaxed text-justify [&_p]:mb-6"
            dangerouslySetInnerHTML={{
              __html: setting?.content || "<p>No content available.</p>",
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
