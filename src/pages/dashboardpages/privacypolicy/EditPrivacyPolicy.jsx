import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Link as RouterLink } from "react-router-dom";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ChevronLeft,
  Bold,
  Italic,
  Underline,
  Strikethrough,
  AlignLeft,
  AlignCenter,
  AlignRight,
  List,
  ListOrdered,
  Link,
  ImageIcon,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchRoleSetting,
  selectRoleSetting,
  selectRoleSettingError,
  selectRoleSettingStatus,
  selectUpsertSettingError,
  selectUpsertSettingStatus,
  upsertAdminSetting,
} from "@/store/settingsSlice";
import SettingsRoleSelector from "@/components/dashboardcomponents/SettingsRoleSelector";
import { useSettingsRole } from "@/lib/useSettingsRole";
import {
  getRoleLabel,
  isRoleSettingEditable,
  isRoleSettingSupported,
} from "@/lib/settingsRoleConfig";

const EditPrivacyPolicy = () => {
  const dispatch = useDispatch();
  const [role, setRole] = useSettingsRole();
  const setting = useSelector(selectRoleSetting(role, "privacy_policy"));
  const status = useSelector(selectRoleSettingStatus(role, "privacy_policy"));
  const error = useSelector(selectRoleSettingError(role, "privacy_policy"));
  const saveStatus = useSelector(selectUpsertSettingStatus("privacy_policy"));
  const saveError = useSelector(selectUpsertSettingError("privacy_policy"));

  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState("16");
  const [initialized, setInitialized] = useState(false);
  const isSupported = isRoleSettingSupported(role, "privacy_policy");
  const isEditable = isRoleSettingEditable(role, "privacy_policy");

  useEffect(() => {
    if (!isSupported) return;
    if (status === "idle") {
      dispatch(fetchRoleSetting({ role, key: "privacy_policy" }));
    }
  }, [dispatch, isSupported, role, status]);

  useEffect(() => {
    if (!initialized && setting?.content !== undefined) {
      setContent(setting?.content || "");
      setInitialized(true);
    }
  }, [initialized, setting]);

  useEffect(() => {
    setInitialized(false);
    setContent("");
  }, [role]);

  const handleSaveChanges = () => {
    if (!isEditable) return;
    dispatch(
      upsertAdminSetting({
        key: "privacy_policy",
        title: "Privacy Policy",
        content,
      })
    )
      .unwrap()
      .then(() => {
        alert("Privacy Policy content saved successfully!");
      })
      .catch(() => {});
  };

  const insertText = (before, after = "") => {
    const newContent = content + before + after;
    setContent(newContent);
  };

  const formatButtons = [
    { icon: Bold, label: "Bold", action: () => insertText("**Bold Text**") },
    {
      icon: Italic,
      label: "Italic",
      action: () => insertText("*Italic Text*"),
    },
    {
      icon: Underline,
      label: "Underline",
      action: () => insertText("<u>Underlined</u>"),
    },
    {
      icon: Strikethrough,
      label: "Strikethrough",
      action: () => insertText("~~Strikethrough~~"),
    },
  ];

  const alignButtons = [
    { icon: AlignLeft, label: "Align Left" },
    { icon: AlignCenter, label: "Align Center" },
    { icon: AlignRight, label: "Align Right" },
  ];

  const listButtons = [
    {
      icon: List,
      label: "Bullet List",
      action: () => insertText("\n• List item"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertText("\n1. List item"),
    },
  ];

  const insertButtons = [
    {
      icon: Link,
      label: "Insert Link",
      action: () => {
        const url = prompt("Enter URL:");
        if (url) insertText(`[Link Text](${url})`);
      },
    },
    {
      icon: ImageIcon,
      label: "Insert Image",
      action: () => {
        const url = prompt("Enter image URL:");
        if (url) insertText(`![Image](${url})`);
      },
    },
  ];

  return (
    <div className="bg-gray-100">
      {/* Header */}
      <div className="bg-[#1C5941] text-white p-4 flex items-center gap-3 rounded-lg">
        <RouterLink to="/dashboard/settings/privacy">
          <ChevronLeft className="h-6 w-6" />
        </RouterLink>
        <h1 className="text-lg font-medium">Edit Privacy Policy</h1>
      </div>
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
        <SettingsRoleSelector value={role} onChange={setRole} />
        {!isEditable && isSupported && (
          <span className="text-sm text-amber-600">
            {getRoleLabel(role)} privacy policy is read-only.
          </span>
        )}
      </div>
      {!isSupported && (
        <div className="mt-4 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-md px-4 py-3">
          Privacy policy is not available for {getRoleLabel(role)}.
        </div>
      )}

      {/* Main Content */}
      <div className="mt-5">
        <div className="mx-auto">
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden shadow-sm">
            {/* Toolbar */}
            <div className="border-b border-gray-200 p-3 bg-gray-50">
              <div className="flex items-center gap-2 flex-wrap">
                {/* Font Size Selector */}
                <Select value={fontSize} onValueChange={setFontSize}>
                  <SelectTrigger className="w-16 h-8 text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["12", "14", "16", "18", "20", "24"].map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Format Buttons */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {formatButtons.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}

                {/* Alignment Buttons (visual only) */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {alignButtons.map(({ icon: Icon, label }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}

                {/* List Buttons */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {listButtons.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}

                {/* Insert Buttons */}
                <div className="w-px h-6 bg-gray-300 mx-1" />
                {insertButtons.map(({ icon: Icon, label, action }) => (
                  <Button
                    key={label}
                    variant="ghost"
                    size="sm"
                    onClick={action}
                    className="h-8 w-8 p-0 hover:bg-gray-200"
                    title={label}
                  >
                    <Icon className="h-4 w-4" />
                  </Button>
                ))}
              </div>
            </div>

            {/* Textarea */}
            <div className="relative">
              {status === "loading" && (
                <div className="px-4 py-3 text-sm text-gray-500">
                  Loading content...
                </div>
              )}
              {status === "failed" && (
                <div className="px-4 py-3 text-sm text-red-500">
                  {error || "Failed to load content."}
                </div>
              )}
              <Textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start typing..."
                className="h-[500px] border-0 resize-none focus:ring-0 focus:outline-none text-sm leading-relaxed overflow-y-auto"
                style={{ fontSize: `${fontSize}px` }}
                disabled={!isSupported || !isEditable}
              />
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleSaveChanges}
                className="bg-[#1C5941] hover:bg-[#1C5941] text-white px-8 py-2 rounded-md"
                disabled={!isEditable || saveStatus === "loading"}
              >
                {saveStatus === "loading" ? "Saving..." : "Save Changes"}
              </Button>
              {saveError && (
                <p className="mt-2 text-sm text-red-500">{saveError}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPrivacyPolicy;
