import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";
import { Link } from "react-router-dom";
import {
  fetchPublicSetting,
  selectPublicSetting,
  selectPublicSettingError,
  selectPublicSettingStatus,
} from "@/store/settingsSlice";
import { selectAdminPermissions } from "@/store/adminAuthSlice";

const PrivacyPolicy = () => {
  const dispatch = useDispatch();
  const setting = useSelector(selectPublicSetting("privacy_policy"));
  const status = useSelector(selectPublicSettingStatus("privacy_policy"));
  const error = useSelector(selectPublicSettingError("privacy_policy"));
  const permissions = useSelector(selectAdminPermissions);
  const canManageSettings = permissions?.canManageSettings ?? true;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPublicSetting("privacy_policy"));
    }
  }, [dispatch, status]);

  return (
    <div className="font-sans pr-5">
      {/* Header */}
      <h2 className="text-xl sm:text-2xl font-bold mb-5 text-white bg-[#1C5941] p-5 rounded-lg">
        Privacy Policy
      </h2>

      {/* Edit Button */}
      {canManageSettings && (
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
