import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { selectAdminPermissions } from "@/store/adminAuthSlice";
import {
  addPinnedItem,
  clearPinnedItems,
  getItemId,
  isDirtyOrder,
  removePinnedItem,
  reorderByIndexes,
  resetPinnedItems,
  uniqueById,
} from "@/lib/discoveryRankingUtils";
import { saveDiscoveryRanking } from "@/lib/discoveryRankingService";
import { AVAILABLE_LIMIT, TAB_CONFIG } from "./config";
import RankingTab from "./RankingTab";

const createTabState = () => ({
  loadingInitial: true,
  loadingAvailable: true,
  saving: false,
  inlineError: "",
  serverPinned: [],
  pinned: [],
  available: [],
  page: 1,
  totalPages: 1,
  search: "",
  filters: {
    verified: false,
    userActive: false,
  },
});

const ToastStack = ({ toasts }) => (
  <div className="fixed right-4 top-4 z-[100] flex w-80 flex-col gap-2">
    {toasts.map((toast) => (
      <div
        key={toast.id}
        className={`rounded-md border px-3 py-2 text-sm shadow ${
          toast.type === "error"
            ? "border-red-200 bg-red-50 text-red-700"
            : "border-emerald-200 bg-emerald-50 text-emerald-700"
        }`}
      >
        {toast.message}
      </div>
    ))}
  </div>
);

const DiscoveryRankingPage = () => {
  const permissions = useSelector(selectAdminPermissions);
  const canManageProviders = permissions?.canManageProviders ?? true;
  const canManageUsers = permissions?.canManageUsers ?? true;

  const allowedTabs = useMemo(() => {
    const tabs = [];
    if (canManageProviders) tabs.push("providers");
    if (canManageUsers) tabs.push("businesses");
    return tabs;
  }, [canManageProviders, canManageUsers]);

  const [activeTab, setActiveTab] = useState(allowedTabs[0] || "providers");
  const [tabState, setTabState] = useState({
    providers: createTabState(),
    businesses: createTabState(),
  });
  const [clearDialogOpen, setClearDialogOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [dragState, setDragState] = useState(null);

  const pushToast = (type, message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  };

  useEffect(() => {
    if (!allowedTabs.includes(activeTab)) {
      setActiveTab(allowedTabs[0] || "providers");
    }
  }, [activeTab, allowedTabs]);

  const updateTabState = (tabKey, updater) => {
    setTabState((prev) => ({
      ...prev,
      [tabKey]: {
        ...prev[tabKey],
        ...updater(prev[tabKey]),
      },
    }));
  };

  const loadAvailablePage = async (tabKey, overrides = {}) => {
    const config = TAB_CONFIG[tabKey];
    const current = { ...tabState[tabKey], ...overrides };
    updateTabState(tabKey, () => ({ loadingAvailable: true, inlineError: "" }));

    try {
      const params = {
        page: current.page,
        limit: AVAILABLE_LIMIT,
        search: current.search.trim(),
      };
      if (tabKey === "providers" && current.filters.verified) {
        params.status = "verified";
      }

      const response = await config.fetchAvailablePage(params);
      const mapped = response.items.map(config.mapItem).filter(Boolean);
      const pinnedIds = new Set(
        current.pinned.map((item) => getItemId(item, config.idKey)).filter(Boolean)
      );

      const filtered = mapped
        .filter((item) => !pinnedIds.has(getItemId(item, config.idKey)))
        .filter((item) =>
          current.filters.userActive ? Boolean(item.isUserActive) : true
        );

      updateTabState(tabKey, () => ({
        loadingAvailable: false,
        available: filtered,
        totalPages: response.totalPages || 1,
        page: response.currentPage || current.page,
      }));
    } catch (error) {
      updateTabState(tabKey, () => ({
        loadingAvailable: false,
        inlineError:
          error?.response?.data?.message || "Failed to load available items.",
      }));
    }
  };

  const loadTab = async (tabKey) => {
    const config = TAB_CONFIG[tabKey];
    updateTabState(tabKey, () => ({
      loadingInitial: true,
      loadingAvailable: true,
      inlineError: "",
    }));

    try {
      const rankingRaw = await config.fetchRanking();
      const rankingMapped = uniqueById(
        rankingRaw.map(config.mapItem).filter(Boolean),
        config.idKey
      );

      updateTabState(tabKey, () => ({
        loadingInitial: false,
        serverPinned: rankingMapped,
        pinned: rankingMapped,
        page: 1,
      }));

      await loadAvailablePage(tabKey, {
        pinned: rankingMapped,
        page: 1,
        search: "",
        filters: { verified: false, userActive: false },
      });
    } catch (error) {
      updateTabState(tabKey, () => ({
        loadingInitial: false,
        loadingAvailable: false,
        inlineError: error?.response?.data?.message || "Failed to load ranking.",
      }));
    }
  };

  useEffect(() => {
    allowedTabs.forEach((tabKey) => {
      if (tabState[tabKey].loadingInitial) {
        loadTab(tabKey);
      }
    });
  }, [allowedTabs]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!allowedTabs.length) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>No permission to manage discovery ranking</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const current = tabState[activeTab];
  const config = TAB_CONFIG[activeTab];
  const isDirty = isDirtyOrder(current.pinned, current.serverPinned, config.idKey);

  const handleSearch = async (value) => {
    updateTabState(activeTab, () => ({ search: value, page: 1 }));
    await loadAvailablePage(activeTab, { search: value, page: 1 });
  };

  const handleToggleFilter = async (filterKey) => {
    const nextFilters = {
      ...current.filters,
      [filterKey]: !current.filters[filterKey],
    };
    updateTabState(activeTab, () => ({
      filters: nextFilters,
      page: 1,
    }));
    await loadAvailablePage(activeTab, { filters: nextFilters, page: 1 });
  };

  const handlePageChange = async (nextPage) => {
    updateTabState(activeTab, () => ({ page: nextPage }));
    await loadAvailablePage(activeTab, { page: nextPage });
  };

  const handlePin = (item) => {
    updateTabState(activeTab, (state) => {
      const result = addPinnedItem(state.pinned, item, config.idKey);
      if (result.reason === "duplicate") {
        pushToast("error", "Item is already pinned.");
      }
      if (result.reason === "max_limit") {
        pushToast("error", "Pinned limit reached (100).");
      }
      return {
        pinned: result.items,
        available: state.available.filter(
          (entry) =>
            getItemId(entry, config.idKey) !== getItemId(item, config.idKey)
        ),
      };
    });
  };

  const handleRemove = (id) => {
    const nextPinned = removePinnedItem(current.pinned, id, config.idKey);
    updateTabState(activeTab, (state) => ({
      pinned: nextPinned,
    }));
    loadAvailablePage(activeTab, { pinned: nextPinned });
  };

  const handleReorder = (fromIndex, toIndex) => {
    updateTabState(activeTab, (state) => ({
      pinned: reorderByIndexes(state.pinned, fromIndex, toIndex),
    }));
  };

  const handleSave = async (forcedPinned = null) => {
    const pinnedToSave = forcedPinned || current.pinned;
    updateTabState(activeTab, () => ({ saving: true, inlineError: "" }));
    try {
      await saveDiscoveryRanking({
        kind: activeTab,
        pinnedItems: pinnedToSave,
        idKey: config.idKey,
      });
      updateTabState(activeTab, () => ({
        saving: false,
        pinned: pinnedToSave,
        serverPinned: pinnedToSave,
      }));
      pushToast("success", "Ranking saved successfully.");
    } catch (error) {
      const invalidIds =
        error?.status === 400 && error?.invalidIds?.length
          ? ` Invalid IDs: ${error.invalidIds.join(", ")}`
          : "";
      updateTabState(activeTab, () => ({
        saving: false,
        inlineError: `${error.message}${invalidIds}`,
      }));
      pushToast("error", "Failed to save ranking.");
    }
  };

  const handleReset = () => {
    const nextPinned = resetPinnedItems(current.serverPinned);
    updateTabState(activeTab, (state) => ({
      pinned: nextPinned,
      inlineError: "",
    }));
    loadAvailablePage(activeTab, { pinned: nextPinned });
  };

  const handleClearAll = async () => {
    const nextPinned = clearPinnedItems();
    updateTabState(activeTab, () => ({ pinned: nextPinned }));
    setClearDialogOpen(false);
    await handleSave(nextPinned);
    await loadAvailablePage(activeTab, { pinned: nextPinned });
  };

  const onStartDragPinned = (index) => setDragState({ source: "pinned", index });
  const onStartDragAvailable = (item) => setDragState({ source: "available", item });
  const onEndDrag = () => setDragState(null);

  const onDropPinnedItem = (targetIndex) => {
    if (!dragState) return;
    if (dragState.source === "pinned") {
      handleReorder(dragState.index, targetIndex);
      onEndDrag();
      return;
    }
    if (dragState.source === "available") {
      const item = dragState.item;
      updateTabState(activeTab, (state) => {
        const result = addPinnedItem(state.pinned, item, config.idKey);
        if (result.reason) return {};
        const inserted = [...result.items];
        const moved = reorderByIndexes(inserted, inserted.length - 1, targetIndex);
        return {
          pinned: moved,
          available: state.available.filter(
            (entry) =>
              getItemId(entry, config.idKey) !== getItemId(item, config.idKey)
          ),
        };
      });
      onEndDrag();
    }
  };

  const onDropPinnedPanel = () => {
    if (!dragState || dragState.source !== "available") return;
    handlePin(dragState.item);
    onEndDrag();
  };

  return (
    <div className="space-y-4 pb-20">
      <ToastStack toasts={toasts} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Discovery Ranking</h2>
          <p className="text-sm text-gray-600">
            Pin and order items shown first in public discovery.
          </p>
        </div>
        {isDirty ? (
          <Badge className="bg-amber-100 text-amber-700 hover:bg-amber-100">
            Unsaved changes
          </Badge>
        ) : (
          <Badge className="bg-emerald-100 text-emerald-700 hover:bg-emerald-100">
            Synced
          </Badge>
        )}
      </div>

      <div className="inline-flex h-9 items-center rounded-lg bg-gray-100 p-1">
        {allowedTabs.includes("providers") && (
          <button
            type="button"
            className={`rounded-md px-3 py-1 text-sm ${
              activeTab === "providers" ? "bg-white shadow-sm" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("providers")}
          >
            Providers
          </button>
        )}
        {allowedTabs.includes("businesses") && (
          <button
            type="button"
            className={`rounded-md px-3 py-1 text-sm ${
              activeTab === "businesses" ? "bg-white shadow-sm" : "text-gray-600"
            }`}
            onClick={() => setActiveTab("businesses")}
          >
            Businesses
          </button>
        )}
      </div>

      <RankingTab
        tabKey={activeTab}
        state={current}
        isDirty={isDirty}
        onSearch={handleSearch}
        onToggleFilter={handleToggleFilter}
        onSave={handleSave}
        onReset={handleReset}
        onClearAll={() => setClearDialogOpen(true)}
        onPin={handlePin}
        onRemove={handleRemove}
        onPageChange={handlePageChange}
        onStartDragAvailable={onStartDragAvailable}
        onStartDragPinned={onStartDragPinned}
        onEndDrag={onEndDrag}
        onDropPinnedItem={onDropPinnedItem}
        onDropPinnedPanel={onDropPinnedPanel}
      />

      {isDirty ? (
        <div className="fixed bottom-0 left-0 right-0 z-50 border-t bg-white/95 backdrop-blur">
          <div className="mx-auto flex max-w-[1200px] items-center justify-between gap-3 px-4 py-3">
            <div className="flex items-center gap-2 text-sm text-amber-700">
              <AlertTriangle className="h-4 w-4" />
              You have unsaved changes
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleReset} disabled={current.saving}>
                Reset
              </Button>
              <Button
                className="bg-[#1C5941] hover:bg-[#1C5941]"
                onClick={() => handleSave()}
                disabled={current.saving}
              >
                Save
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      <AlertDialog open={clearDialogOpen} onOpenChange={setClearDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Clear all pinned items?</AlertDialogTitle>
          </AlertDialogHeader>
          <p className="text-sm text-gray-600">
            This will clear all pinned items and save immediately.
          </p>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleClearAll}
              className="bg-red-600 hover:bg-red-700"
            >
              Clear all
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default DiscoveryRankingPage;
