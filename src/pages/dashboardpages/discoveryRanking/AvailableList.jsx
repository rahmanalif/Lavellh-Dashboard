import { Button } from "@/components/ui/button";
import RankingCard from "./RankingCard";

const AvailableList = ({
  tabKey,
  items,
  page,
  totalPages,
  loading,
  onPageChange,
  onPin,
  onStartDragAvailable,
  onEndDrag,
}) => (
  <section className="rounded-lg border bg-white p-4">
    <h3 className="mb-3 text-sm font-semibold text-gray-800">Available list</h3>
    <div className="space-y-2">
      {loading ? (
        <p className="py-6 text-center text-sm text-gray-500">
          Loading available items...
        </p>
      ) : items.length ? (
        items.map((item) => (
          <RankingCard
            key={item.providerId || item.businessOwnerId}
            item={item}
            tabKey={tabKey}
            title={item.name || item.businessName}
            onPin={() => onPin(item)}
            draggable
            onDragStart={() => onStartDragAvailable(item)}
            onDragEnd={onEndDrag}
          />
        ))
      ) : (
        <p className="py-6 text-center text-sm text-gray-500">
          No available items found.
        </p>
      )}
    </div>
    <div className="mt-3 flex items-center justify-between">
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={page <= 1}
        onClick={() => onPageChange(page - 1)}
      >
        Previous
      </Button>
      <span className="text-xs text-gray-500">
        Page {page} / {Math.max(totalPages, 1)}
      </span>
      <Button
        type="button"
        size="sm"
        variant="outline"
        disabled={page >= totalPages}
        onClick={() => onPageChange(page + 1)}
      >
        Next
      </Button>
    </div>
  </section>
);

export default AvailableList;
