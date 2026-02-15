export const USER_TYPE_OPTIONS = [
  { label: "User", value: "user" },
  { label: "Provider", value: "provider" },
  { label: "Business Owner", value: "businessOwner" },
  { label: "Event Manager", value: "eventManager" },
];

export const ALL_USER_TYPES = USER_TYPE_OPTIONS.map((item) => item.value);

export const createInitialBroadcastState = () => ({
  title: "",
  body: "",
  userTypes: [...ALL_USER_TYPES],
  includeInactive: false,
  sendPush: true,
  submitting: false,
  result: null,
  error: null,
});

export const validateBroadcastForm = ({ title, body, userTypes }) => {
  const errors = {};
  if (!String(title || "").trim()) {
    errors.title = "Title is required.";
  }
  if (!String(body || "").trim()) {
    errors.body = "Message is required.";
  }
  if (!Array.isArray(userTypes) || userTypes.length === 0) {
    errors.userTypes = "Select at least one audience type.";
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
};

export const toBroadcastPayload = ({
  title,
  body,
  userTypes,
  includeInactive,
  sendPush,
}) => ({
  title: String(title || "").trim(),
  body: String(body || "").trim(),
  userTypes: [...(userTypes || [])],
  includeInactive: Boolean(includeInactive),
  sendPush: Boolean(sendPush),
});

export const toggleUserType = (selected = [], userType) => {
  if (!userType) return [...selected];
  if (selected.includes(userType)) {
    return selected.filter((item) => item !== userType);
  }
  return [...selected, userType];
};

export const mapInvalidUserTypes = (error) => {
  const invalid = error?.response?.data?.invalidUserTypes;
  return Array.isArray(invalid) ? invalid : [];
};

export const canSendBroadcast = (permissions) =>
  Boolean(permissions?.canManageSettings ?? true);

export const isSendDisabled = (submitting) => Boolean(submitting);
