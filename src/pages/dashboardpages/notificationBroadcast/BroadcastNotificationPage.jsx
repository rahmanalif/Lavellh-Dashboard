import { useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { selectAdminPermissions } from "@/store/adminAuthSlice";
import {
  ALL_USER_TYPES,
  canSendBroadcast,
  createInitialBroadcastState,
  toggleUserType,
  validateBroadcastForm,
} from "@/lib/broadcastNotificationUtils";
import { sendBroadcastNotification } from "@/lib/broadcastNotificationService";
import BroadcastForm from "./BroadcastForm";
import BroadcastResultCard from "./BroadcastResultCard";
import ConfirmSendModal from "./ConfirmSendModal";

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

const BroadcastNotificationPage = () => {
  const permissions = useSelector(selectAdminPermissions);
  const canManageSettings = canSendBroadcast(permissions);

  const [form, setForm] = useState(createInitialBroadcastState());
  const [validationErrors, setValidationErrors] = useState({});
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toasts, setToasts] = useState([]);

  const pushToast = (type, message) => {
    const id = `${Date.now()}-${Math.random()}`;
    setToasts((prev) => [...prev, { id, type, message }]);
    window.setTimeout(() => {
      setToasts((prev) => prev.filter((item) => item.id !== id));
    }, 3000);
  };

  const inlineApiError = useMemo(() => {
    if (!form.error) return "";
    const invalidUserTypes = form.error.invalidUserTypes;
    if (invalidUserTypes?.length) {
      return `${form.error.message} Invalid user types: ${invalidUserTypes.join(
        ", "
      )}`;
    }
    return form.error.message;
  }, [form.error]);

  if (!canManageSettings) {
    return (
      <Card className="border-none shadow-none">
        <CardHeader>
          <CardTitle>You do not have permission to send broadcasts.</CardTitle>
        </CardHeader>
      </Card>
    );
  }

  const updateField = (key, value) => {
    setForm((prev) => ({
      ...prev,
      [key]: value,
      error: null,
    }));
  };

  const handleToggleUserType = (userType) => {
    setForm((prev) => ({
      ...prev,
      userTypes: toggleUserType(prev.userTypes, userType),
      error: null,
    }));
  };

  const handleSelectAllUserTypes = () => {
    setForm((prev) => ({
      ...prev,
      userTypes:
        prev.userTypes.length === ALL_USER_TYPES.length ? [] : [...ALL_USER_TYPES],
      error: null,
    }));
  };

  const handleTrySubmit = () => {
    const validation = validateBroadcastForm(form);
    if (!validation.valid) {
      setValidationErrors(validation.errors);
      return;
    }
    setValidationErrors({});
    setConfirmOpen(true);
  };

  const handleReset = () => {
    setForm(createInitialBroadcastState());
    setValidationErrors({});
  };

  const handleConfirmSend = async () => {
    setConfirmOpen(false);
    setForm((prev) => ({ ...prev, submitting: true, error: null }));
    try {
      const { result } = await sendBroadcastNotification({ form });
      setForm((prev) => ({
        ...prev,
        submitting: false,
        result,
      }));
      pushToast("success", "Broadcast notification sent successfully.");
    } catch (error) {
      setForm((prev) => ({
        ...prev,
        submitting: false,
        error: {
          message: error.message || "Failed to send broadcast notification.",
          invalidUserTypes: error.invalidUserTypes || [],
        },
      }));
      pushToast("error", "Broadcast send failed.");
    }
  };

  return (
    <div className="space-y-4">
      <ToastStack toasts={toasts} />

      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-gray-900">
            Broadcast Notification
          </h2>
          <p className="text-sm text-gray-600">
            Send announcement to users, providers, business owners, and event
            managers.
          </p>
        </div>
        <Badge className="bg-slate-100 text-slate-700 hover:bg-slate-100">
          canManageSettings
        </Badge>
      </div>

      {inlineApiError ? (
        <div className="rounded border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {inlineApiError}
        </div>
      ) : null}

      <BroadcastForm
        form={form}
        errors={validationErrors}
        onChange={updateField}
        onToggleUserType={handleToggleUserType}
        onSelectAllUserTypes={handleSelectAllUserTypes}
        onSubmit={handleTrySubmit}
        onReset={handleReset}
      />

      <BroadcastResultCard result={form.result} />

      <ConfirmSendModal
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        onConfirm={handleConfirmSend}
      />
    </div>
  );
};

export default BroadcastNotificationPage;
