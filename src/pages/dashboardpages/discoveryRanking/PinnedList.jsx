import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import RankingCard from "./RankingCard";

const PinnedList = ({
  tabKey,
  items,
  maxItems,
  onRemove,
  onDragStartPinned,
  onEndDrag,
  onDropPinnedItem,
  onDropPinnedPanel,
}) => (
  <section
    className="rounded-lg border bg-white p-4"
    onDragOver={(event) => event.preventDefault()}
    onDrop={onDropPinnedPanel}
  >
    <div className="mb-3 flex items-center justify-between">
      <h3 className="text-sm font-semibold text-gray-800">
        Pinned order ({items.length}/{maxItems})
      </h3>
      <Badge variant="outline">Top to bottom</Badge>
    </div>
    {items.length ? (
      <div className="space-y-2">
        {items.map((item, index) => (
          <RankingCard
            key={item.providerId || item.businessOwnerId}
            item={item}
            tabKey={tabKey}
            title={item.name || item.businessName}
            pinned
            rank={index + 1}
            onRemove={() =>
              onRemove(item.providerId || item.businessOwnerId)
            }
            draggable
            onDragStart={() => onDragStartPinned(index)}
            onDragEnd={onEndDrag}
            onDragOver={(event) => event.preventDefault()}
            onDrop={() => onDropPinnedItem(index)}
          />
        ))}
      </div>
    ) : (
      <div className="rounded-md border border-dashed py-12 text-center text-sm text-gray-500">
        No pinned items yet.
        <div className="mt-2 flex items-center justify-center gap-1 text-xs">
          <ArrowUpDown className="h-3 w-3" />
          Drag items here or use Pin.
        </div>
      </div>
    )}
  </section>
);

export default PinnedList;
