import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
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
  Link as LinkIcon,
  ImageIcon,
} from "lucide-react";
import {
  fetchAdminSetting,
  selectAdminSetting,
  selectAdminSettingError,
  selectAdminSettingStatus,
  selectUpsertSettingError,
  selectUpsertSettingStatus,
  upsertAdminSetting,
} from "@/store/settingsSlice";

const EditFAQ = () => {
  const dispatch = useDispatch();
  const setting = useSelector(selectAdminSetting("faq"));
  const status = useSelector(selectAdminSettingStatus("faq"));
  const error = useSelector(selectAdminSettingError("faq"));
  const saveStatus = useSelector(selectUpsertSettingStatus("faq"));
  const saveError = useSelector(selectUpsertSettingError("faq"));

  const [content, setContent] = useState("");
  const [fontSize, setFontSize] = useState("16");
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (status === "idle") {
      dispatch(fetchAdminSetting("faq"));
    }
  }, [dispatch, status]);

  useEffect(() => {
    if (!initialized && setting?.content !== undefined) {
      setContent(setting?.content || "");
      setInitialized(true);
    }
  }, [initialized, setting]);

  const handleSaveChanges = () => {
    dispatch(
      upsertAdminSetting({
        key: "faq",
        title: "FAQ",
        content,
      })
    )
      .unwrap()
      .then(() => {
        alert("FAQ saved successfully!");
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
      action: () => insertText("\n- List item"),
    },
    {
      icon: ListOrdered,
      label: "Numbered List",
      action: () => insertText("\n1. List item"),
    },
  ];

  const insertButtons = [
    {
      icon: LinkIcon,
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
        <Link to="/dashboard/settings/faq">
          <ChevronLeft className="h-6 w-6" />
        </Link>
        <h1 className="text-lg font-medium">Edit FAQ</h1>
      </div>

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

                {/* Alignment Buttons */}
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
              />
            </div>

            {/* Save Button */}
            <div className="p-4 border-t border-gray-200">
              <Button
                onClick={handleSaveChanges}
                className="bg-[#1C5941] hover:bg-[#1C5941] text-white px-8 py-2 rounded-md"
                disabled={saveStatus === "loading"}
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

export default EditFAQ;
