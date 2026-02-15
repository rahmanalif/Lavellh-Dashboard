import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { MAX_PINNED_ITEMS } from "@/lib/discoveryRankingUtils";
import RankingToolbar from "./RankingToolbar";
import AvailableList from "./AvailableList";
import PinnedList from "./PinnedList";

const RankingTab = ({
  tabKey,
  state,
  isDirty,
  onSearch,
  onToggleFilter,
  onSave,
  onReset,
  onClearAll,
  onPin,
  onRemove,
  onPageChange,
  onStartDragAvailable,
  onStartDragPinned,
  onEndDrag,
  onDropPinnedItem,
  onDropPinnedPanel,
}) => {
  if (state.loadingInitial) {
    return (
      <Card className="mt-3 border-none shadow-none">
        <CardContent className="grid gap-4 p-4 md:grid-cols-2">
          <div className="space-y-3 rounded-lg border bg-white p-4">
            <div className="h-9 animate-pulse rounded bg-gray-100" />
            <div className="h-12 animate-pulse rounded bg-gray-100" />
            <div className="h-12 animate-pulse rounded bg-gray-100" />
            <div className="h-12 animate-pulse rounded bg-gray-100" />
          </div>
          <div className="space-y-3 rounded-lg border bg-white p-4">
            <div className="h-9 animate-pulse rounded bg-gray-100" />
            <div className="h-16 animate-pulse rounded bg-gray-100" />
            <div className="h-16 animate-pulse rounded bg-gray-100" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mt-3 border-none shadow-none">
      <CardHeader className="space-y-3">
        <RankingToolbar
          tabKey={tabKey}
          search={state.search}
          filters={state.filters}
          onSearch={onSearch}
          onToggleFilter={onToggleFilter}
          onSave={onSave}
          onReset={onReset}
          onClearAll={onClearAll}
          isDirty={isDirty}
          saving={state.saving}
        />
        {state.inlineError ? (
          <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
            {state.inlineError}
          </div>
        ) : null}
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-2">
        <AvailableList
          tabKey={tabKey}
          items={state.available}
          page={state.page}
          totalPages={state.totalPages}
          loading={state.loadingAvailable}
          onPageChange={onPageChange}
          onPin={onPin}
          onStartDragAvailable={onStartDragAvailable}
          onEndDrag={onEndDrag}
        />
        <PinnedList
          tabKey={tabKey}
          items={state.pinned}
          maxItems={MAX_PINNED_ITEMS}
          onRemove={onRemove}
          onDragStartPinned={onStartDragPinned}
          onEndDrag={onEndDrag}
          onDropPinnedItem={onDropPinnedItem}
          onDropPinnedPanel={onDropPinnedPanel}
        />
      </CardContent>
    </Card>
  );
};

export default RankingTab;
