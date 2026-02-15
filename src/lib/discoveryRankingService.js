import { toOrderedIds } from "./discoveryRankingUtils.js";

const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "Failed to save ranking.";

export const getInvalidIds = (error) => {
  const invalidIds = error?.response?.data?.invalidIds;
  return Array.isArray(invalidIds) ? invalidIds : [];
};

export const saveDiscoveryRanking = async ({
  kind,
  pinnedItems,
  idKey,
  saveProviders,
  saveBusinesses,
}) => {
  const orderedIds = toOrderedIds(pinnedItems, idKey);
  try {
    let runSaveProviders = saveProviders;
    let runSaveBusinesses = saveBusinesses;
    const needsProviders = kind === "providers" && !runSaveProviders;
    const needsBusinesses = kind !== "providers" && !runSaveBusinesses;
    if (needsProviders || needsBusinesses) {
      const api = await import("../api/discoveryRankingApi.js");
      runSaveProviders = runSaveProviders || api.updateProviderRanking;
      runSaveBusinesses = runSaveBusinesses || api.updateBusinessRanking;
    }

    if (kind === "providers") {
      await runSaveProviders(orderedIds);
    } else {
      await runSaveBusinesses(orderedIds);
    }
    return { orderedIds };
  } catch (error) {
    const nextError = new Error(getErrorMessage(error));
    nextError.invalidIds = getInvalidIds(error);
    nextError.status = error?.response?.status;
    throw nextError;
  }
};
