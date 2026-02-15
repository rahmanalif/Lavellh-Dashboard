import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { selectAdminPermissions } from "@/store/adminAuthSlice";
import {
  fetchBusinessReviews,
  fetchProviderReviews,
  hideBusinessReview,
  hideProviderReview,
  restoreBusinessReview,
  restoreProviderReview,
} from "@/api/reviewModerationApi";
import ReviewModerationTabs from "./ReviewModerationTabs";
import ReviewFilters from "./ReviewFilters";
import ProviderReviewTable from "./ProviderReviewTable";
import BusinessReviewTable from "./BusinessReviewTable";
import HideReviewModal from "./HideReviewModal";
import RestoreReviewModal from "./RestoreReviewModal";
import { getReviewId, initialFilters, initialPagination } from "./reviewModerationUtils";

const createTabState = (isProvider = false) => ({
  filters: { ...initialFilters, ...(isProvider ? {} : { minRating: "", maxRating: "" }) },
  pagination: { ...initialPagination },
  rows: [],
  loading: false,
  error: "",
  actionLoadingId: null,
  hideModal: { open: false, item: null, error: "" },
  restoreModal: { open: false, item: null, error: "" },
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

const ReviewModerationPage = () => {
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
  const [state, setState] = useState({
    providers: createTabState(true),
    businesses: createTabState(false),
  });
  const [toasts, setToasts] = useState([]);

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

  const patchTabState = (tab, updater) => {
    setState((prev) => ({
      ...prev,
      [tab]: {
        ...prev[tab],
        ...updater(prev[tab]),
      },
    }));
  };

  const loadTabRows = async (tab, overrides = {}) => {
    const tabState = {
      ...state[tab],
      ...overrides,
      filters: { ...state[tab].filters, ...(overrides.filters || {}) },
      pagination: { ...state[tab].pagination, ...(overrides.pagination || {}) },
    };

    patchTabState(tab, () => ({ loading: true, error: "" }));
    try {
      const params = {
        ...tabState.filters,
        page: tabState.pagination.page,
        limit: tabState.pagination.limit,
      };
      const data =
        tab === "providers"
          ? await fetchProviderReviews(params)
          : await fetchBusinessReviews(params);

      patchTabState(tab, () => ({
        loading: false,
        rows: data?.reviews || [],
        pagination: {
          ...tabState.pagination,
          total: Number(data?.total || 0),
          currentPage: Number(data?.currentPage || tabState.pagination.page),
          page: Number(data?.currentPage || tabState.pagination.page),
          totalPages: Number(data?.totalPages || 1),
        },
      }));
    } catch (error) {
      patchTabState(tab, () => ({
        loading: false,
        error: error?.response?.data?.message || "Failed to load reviews.",
      }));
    }
  };

  useEffect(() => {
    allowedTabs.forEach((tab) => {
      loadTabRows(tab);
    });
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  if (!allowedTabs.length) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>No permission</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600">
            You do not have permission to moderate reviews.
          </p>
        </CardContent>
      </Card>
    );
  }

  const current = state[activeTab];

  const onChangeFilter = (key, value) => {
    patchTabState(activeTab, (tabState) => ({
      filters: { ...tabState.filters, [key]: value },
    }));
  };

  const onApplyFilters = async () => {
    const nextPage = 1;
    patchTabState(activeTab, (tabState) => ({
      pagination: { ...tabState.pagination, page: nextPage },
    }));
    await loadTabRows(activeTab, { pagination: { page: nextPage } });
  };

  const onResetFilters = async () => {
    const nextFilters = { ...initialFilters };
    if (activeTab === "businesses") {
      nextFilters.minRating = "";
      nextFilters.maxRating = "";
    }
    patchTabState(activeTab, (tabState) => ({
      filters: nextFilters,
      pagination: { ...tabState.pagination, page: 1 },
    }));
    await loadTabRows(activeTab, { filters: nextFilters, pagination: { page: 1 } });
  };

  const onChangePage = async (page) => {
    const next = Math.max(1, Math.min(current.pagination.totalPages || 1, page));
    patchTabState(activeTab, (tabState) => ({
      pagination: { ...tabState.pagination, page: next },
    }));
    await loadTabRows(activeTab, { pagination: { page: next } });
  };

  const openHide = (item) =>
    patchTabState(activeTab, (tabState) => ({
      hideModal: { ...tabState.hideModal, open: true, item, error: "" },
    }));

  const openRestore = (item) =>
    patchTabState(activeTab, (tabState) => ({
      restoreModal: { ...tabState.restoreModal, open: true, item, error: "" },
    }));

  const closeHide = () =>
    patchTabState(activeTab, (tabState) => ({
      hideModal: { ...tabState.hideModal, open: false, item: null, error: "" },
    }));

  const closeRestore = () =>
    patchTabState(activeTab, (tabState) => ({
      restoreModal: { ...tabState.restoreModal, open: false, item: null, error: "" },
    }));

  const submitHide = async (reason) => {
    const item = current.hideModal.item;
    const id = getReviewId(item);
    if (!id) return;

    patchTabState(activeTab, () => ({ actionLoadingId: id }));
    try {
      if (activeTab === "providers") {
        await hideProviderReview(id, reason);
      } else {
        await hideBusinessReview({
          id,
          sourceType: item?.sourceType || "booking",
          reason,
        });
      }
      patchTabState(activeTab, (tabState) => ({
        rows: tabState.rows.map((row) =>
          getReviewId(row) === id ? { ...row, moderationStatus: "hidden_by_admin" } : row
        ),
        actionLoadingId: null,
      }));
      closeHide();
      pushToast("success", "Review hidden successfully.");
      await loadTabRows(activeTab);
    } catch (error) {
      patchTabState(activeTab, (tabState) => ({
        actionLoadingId: null,
        hideModal: {
          ...tabState.hideModal,
          error: error?.response?.data?.message || "Failed to hide review.",
        },
      }));
      pushToast("error", "Failed to hide review.");
    }
  };

  const submitRestore = async () => {
    const item = current.restoreModal.item;
    const id = getReviewId(item);
    if (!id) return;

    patchTabState(activeTab, () => ({ actionLoadingId: id }));
    try {
      if (activeTab === "providers") {
        await restoreProviderReview(id);
      } else {
        await restoreBusinessReview({
          id,
          sourceType: item?.sourceType || "booking",
        });
      }
      patchTabState(activeTab, (tabState) => ({
        rows: tabState.rows.map((row) =>
          getReviewId(row) === id ? { ...row, moderationStatus: "active" } : row
        ),
        actionLoadingId: null,
      }));
      closeRestore();
      pushToast("success", "Review restored successfully.");
      await loadTabRows(activeTab);
    } catch (error) {
      patchTabState(activeTab, (tabState) => ({
        actionLoadingId: null,
        restoreModal: {
          ...tabState.restoreModal,
          error: error?.response?.data?.message || "Failed to restore review.",
        },
      }));
      pushToast("error", "Failed to restore review.");
    }
  };

  return (
    <div className="space-y-4">
      <ToastStack toasts={toasts} />

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">Review Moderation</h2>
          <p className="text-sm text-gray-600">Hide or restore inappropriate reviews.</p>
        </div>
        <Badge variant="secondary">Follow moderation policy before action</Badge>
      </div>

      <ReviewModerationTabs
        allowedTabs={allowedTabs}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      <ReviewFilters
        tab={activeTab}
        filters={current.filters}
        onChange={onChangeFilter}
        onApply={onApplyFilters}
        onReset={onResetFilters}
        disabled={current.loading}
      />

      {activeTab === "providers" ? (
        <ProviderReviewTable
          rows={current.rows}
          loading={current.loading}
          error={current.error}
          actionLoadingId={current.actionLoadingId}
          onHide={openHide}
          onRestore={openRestore}
        />
      ) : (
        <BusinessReviewTable
          rows={current.rows}
          loading={current.loading}
          error={current.error}
          actionLoadingId={current.actionLoadingId}
          onHide={openHide}
          onRestore={openRestore}
        />
      )}

      <div className="flex items-center justify-between rounded-lg border bg-white p-3">
        <p className="text-sm text-gray-600">
          Page {current.pagination.page} of {current.pagination.totalPages || 1}
        </p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={current.pagination.page <= 1 || current.loading}
            onClick={() => onChangePage(current.pagination.page - 1)}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            disabled={
              current.pagination.page >= (current.pagination.totalPages || 1) ||
              current.loading
            }
            onClick={() => onChangePage(current.pagination.page + 1)}
          >
            Next
          </Button>
        </div>
      </div>

      <HideReviewModal
        open={current.hideModal.open}
        onOpenChange={(open) => (open ? null : closeHide())}
        onConfirm={submitHide}
        submitting={Boolean(current.actionLoadingId)}
        error={current.hideModal.error}
      />
      <RestoreReviewModal
        open={current.restoreModal.open}
        onOpenChange={(open) => (open ? null : closeRestore())}
        onConfirm={submitRestore}
        submitting={Boolean(current.actionLoadingId)}
        error={current.restoreModal.error}
      />
    </div>
  );
};

export default ReviewModerationPage;
