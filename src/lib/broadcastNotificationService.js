import { mapInvalidUserTypes, toBroadcastPayload } from "./broadcastNotificationUtils.js";

const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Failed to send broadcast notification.";

export const sendBroadcastNotification = async ({
  form,
  send,
}) => {
  try {
    const payload = toBroadcastPayload(form);
    let runSend = send;
    if (!runSend) {
      const api = await import("../api/adminNotificationsApi.js");
      runSend = api.broadcastNotification;
    }
    const response = await runSend(payload);
    return {
      payload,
      result: response?.data || response,
    };
  } catch (error) {
    const nextError = new Error(getErrorMessage(error));
    nextError.invalidUserTypes = mapInvalidUserTypes(error);
    throw nextError;
  }
};
