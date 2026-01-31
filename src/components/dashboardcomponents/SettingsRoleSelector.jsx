import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SETTINGS_ROLES } from "@/lib/settingsRoleConfig";

const SettingsRoleSelector = ({ value, onChange }) => {
  return (
    <div className="flex items-center gap-3">
      <span className="text-sm text-gray-600">Role</span>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-52 bg-white">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          {SETTINGS_ROLES.map((role) => (
            <SelectItem key={role.value} value={role.value}>
              {role.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default SettingsRoleSelector;
