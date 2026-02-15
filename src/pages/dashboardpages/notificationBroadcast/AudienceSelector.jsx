import { Button } from "@/components/ui/button";
import { USER_TYPE_OPTIONS } from "@/lib/broadcastNotificationUtils";

const AudienceSelector = ({ selected, error, onToggle, onSelectAll }) => {
  const isAllSelected = selected.length === USER_TYPE_OPTIONS.length;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="text-sm font-semibold text-gray-800">Audience</h4>
        <Button type="button" variant="outline" size="sm" onClick={onSelectAll}>
          {isAllSelected ? "Clear all" : "Select all"}
        </Button>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {USER_TYPE_OPTIONS.map((option) => (
          <label
            key={option.value}
            className="flex items-center gap-2 rounded border bg-white px-3 py-2 text-sm"
          >
            <input
              type="checkbox"
              checked={selected.includes(option.value)}
              onChange={() => onToggle(option.value)}
            />
            <span>{option.label}</span>
          </label>
        ))}
      </div>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
    </div>
  );
};

export default AudienceSelector;
