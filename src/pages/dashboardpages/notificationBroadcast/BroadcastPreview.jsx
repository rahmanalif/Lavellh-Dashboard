import { Badge } from "@/components/ui/badge";
import {
  USER_TYPE_OPTIONS,
  ALL_USER_TYPES,
} from "@/lib/broadcastNotificationUtils";

const labelByValue = Object.fromEntries(
  USER_TYPE_OPTIONS.map((item) => [item.value, item.label])
);

const BroadcastPreview = ({ title, body, userTypes, includeInactive, sendPush }) => {
  const audience =
    userTypes.length === ALL_USER_TYPES.length
      ? "All types"
      : userTypes.map((value) => labelByValue[value] || value).join(", ");

  return (
    <div className="rounded-lg border bg-gray-50 p-4">
      <h4 className="mb-2 text-sm font-semibold text-gray-800">Preview</h4>
      <p className="text-sm font-medium text-gray-900">{title || "No title yet"}</p>
      <p className="mt-1 whitespace-pre-wrap text-sm text-gray-700">
        {body || "No message yet"}
      </p>
      <div className="mt-3 flex flex-wrap gap-2">
        <Badge variant="secondary">{audience || "No audience selected"}</Badge>
        <Badge variant="secondary">
          {includeInactive ? "Include inactive" : "Active users only"}
        </Badge>
        <Badge variant="secondary">{sendPush ? "Push enabled" : "Push disabled"}</Badge>
      </div>
    </div>
  );
};

export default BroadcastPreview;
