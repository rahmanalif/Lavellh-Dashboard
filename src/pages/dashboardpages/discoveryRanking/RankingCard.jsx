import { GripVertical, X } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const getDisplayInitials = (name) =>
  String(name || "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "?";

const RankingCard = ({
  item,
  tabKey,
  title,
  rank,
  onPin,
  onRemove,
  draggable,
  onDragStart,
  onDragEnd,
  onDragOver,
  onDrop,
  pinned = false,
}) => (
  <div
    className="flex items-center justify-between rounded-lg border bg-white px-3 py-2"
    draggable={draggable}
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    onDragOver={onDragOver}
    onDrop={onDrop}
  >
    <div className="flex min-w-0 items-center gap-2">
      {pinned && (
        <>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-emerald-100 text-xs font-semibold text-emerald-700">
            #{rank}
          </span>
          <GripVertical className="h-4 w-4 text-gray-400" />
        </>
      )}
      <Avatar className="h-9 w-9">
        <AvatarImage src={item.image} />
        <AvatarFallback>{getDisplayInitials(title)}</AvatarFallback>
      </Avatar>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-gray-900">{title}</p>
        <div className="mt-1 flex flex-wrap gap-1">
          {tabKey === "providers" && (
            <Badge variant="secondary">{item.verificationStatus || "unknown"}</Badge>
          )}
          {tabKey === "providers" && (
            <Badge variant="secondary">rating {Number(item.rating || 0).toFixed(1)}</Badge>
          )}
          {item.location ? (
            <Badge variant="secondary" className="max-w-[160px] truncate">
              {item.location}
            </Badge>
          ) : null}
          <Badge variant="secondary">
            {item.isUserActive ? "user active" : "user inactive"}
          </Badge>
        </div>
      </div>
    </div>

    {pinned ? (
      <Button type="button" variant="ghost" size="icon" onClick={onRemove}>
        <X className="h-4 w-4 text-red-500" />
      </Button>
    ) : (
      <Button type="button" size="sm" onClick={onPin}>
        Pin
      </Button>
    )}
  </div>
);

export default RankingCard;
