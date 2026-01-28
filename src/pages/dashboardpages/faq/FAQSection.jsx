"use client";

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

export function FAQSection() {
  const dispatch = useDispatch();
  const setting = useSelector(selectPublicSetting("faq"));
  const status = useSelector(selectPublicSettingStatus("faq"));
  const error = useSelector(selectPublicSettingError("faq"));
  const permissions = useSelector(selectAdminPermissions);
  const canManageSettings = permissions?.canManageSettings ?? true;

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchPublicSetting("faq"));
    }
  }, [dispatch, status]);

  return (
    <div className="rounded-lg border bg-card p-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-xl font-semibold">FAQ</h2>
        {canManageSettings && (
          <Link to="/dashboard/settings/editfaq">
            <Button className="bg-[#1C5941] hover:bg-[#1C5941] text-white rounded-full flex items-center space-x-1 shadow-md">
              <Edit className="h-4 w-4" />
              <span>Edit</span>
            </Button>
          </Link>
        )}
      </div>

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
