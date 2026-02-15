import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReviewFilters = ({
  tab,
  filters,
  onChange,
  onApply,
  onReset,
  disabled,
}) => (
  <div className="rounded-lg border bg-white p-3">
    <div className="flex flex-wrap items-center gap-2">
      <div className="relative min-w-[220px] flex-1">
        <Search className="pointer-events-none absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
        <Input
          value={filters.search}
          onChange={(event) => onChange("search", event.target.value)}
          placeholder="Search review text or reviewer"
          className="pl-9"
          onKeyDown={(event) => {
            if (event.key === "Enter") onApply();
          }}
        />
      </div>

      <Select
        value={filters.moderationStatus}
        onValueChange={(value) => onChange("moderationStatus", value)}
      >
        <SelectTrigger className="w-[170px]">
          <SelectValue placeholder="Moderation status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All</SelectItem>
          <SelectItem value="active">Active</SelectItem>
          <SelectItem value="hidden_by_admin">Hidden</SelectItem>
        </SelectContent>
      </Select>

      {tab === "providers" && (
        <>
          <Input
            type="number"
            min="1"
            max="5"
            value={filters.minRating}
            onChange={(event) => onChange("minRating", event.target.value)}
            className="w-[110px]"
            placeholder="Min rating"
          />
          <Input
            type="number"
            min="1"
            max="5"
            value={filters.maxRating}
            onChange={(event) => onChange("maxRating", event.target.value)}
            className="w-[110px]"
            placeholder="Max rating"
          />
        </>
      )}

      <Button type="button" onClick={onApply} disabled={disabled}>
        Apply
      </Button>
      <Button type="button" variant="outline" onClick={onReset} disabled={disabled}>
        <RotateCcw className="mr-2 h-4 w-4" />
        Reset filters
      </Button>
    </div>
  </div>
);

export default ReviewFilters;
