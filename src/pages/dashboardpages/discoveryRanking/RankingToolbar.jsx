import { Loader2, RefreshCw, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const Chip = ({ active, onClick, children }) => (
  <Button
    type="button"
    size="sm"
    variant={active ? "default" : "outline"}
    className={active ? "bg-[#1C5941] hover:bg-[#1C5941]" : ""}
    onClick={onClick}
  >
    {children}
  </Button>
);

const RankingToolbar = ({
  tabKey,
  search,
  onSearch,
  filters,
  onToggleFilter,
  onSave,
  onReset,
  onClearAll,
  isDirty,
  saving,
}) => (
  <div className="space-y-3">
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative w-60">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          value={search}
          onChange={(event) => onSearch(event.target.value)}
          className="pl-9"
          placeholder="Search available list"
        />
      </div>

      {tabKey === "providers" && (
        <Chip
          active={filters.verified}
          onClick={() => onToggleFilter("verified")}
        >
          Verified
        </Chip>
      )}
      <Chip active={filters.userActive} onClick={() => onToggleFilter("userActive")}>
        User Active
      </Chip>

      <div className="ml-auto flex flex-wrap gap-2">
        <Button
          type="button"
          onClick={onSave}
          className="bg-[#1C5941] hover:bg-[#1C5941]"
          disabled={!isDirty || saving}
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving
            </>
          ) : (
            "Save"
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          disabled={!isDirty || saving}
          onClick={onReset}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Reset changes
        </Button>
        <Button type="button" variant="destructive" disabled={saving} onClick={onClearAll}>
          Clear all
        </Button>
      </div>
    </div>
  </div>
);

export default RankingToolbar;
