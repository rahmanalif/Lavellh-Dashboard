import {
  fetchBusinessAvailablePage,
  fetchBusinessRanking,
  fetchProviderAvailablePage,
  fetchProviderRanking,
} from "@/api/discoveryRankingApi";

export const AVAILABLE_LIMIT = 20;

const toProviderItem = (item) => {
  const id = item?.providerId || item?._id || item?.id;
  if (!id) return null;
  const user = item?.userId || item?.user || {};
  return {
    providerId: id,
    name: item?.name || user?.fullName || user?.name || "Unnamed Provider",
    image: item?.profileImage || user?.profilePicture || user?.image || "",
    isUserActive:
      typeof item?.isUserActive === "boolean" ? item.isUserActive : user?.isActive,
    verificationStatus:
      item?.verificationStatus || (item?.isApproved ? "verified" : "pending"),
    rating: item?.rating ?? 0,
    location: user?.location?.address || "",
    pinOrder: item?.pinOrder,
    pinnedAt: item?.pinnedAt,
  };
};

const toBusinessItem = (item) => {
  const id = item?.businessOwnerId || item?._id || item?.id;
  if (!id) return null;
  const user = item?.userId || item?.user || {};
  return {
    businessOwnerId: id,
    businessName:
      item?.businessName || item?.name || user?.fullName || "Unnamed Business",
    image: item?.businessPhoto || user?.profilePicture || "",
    location:
      item?.businessAddress?.fullAddress ||
      item?.businessAddress ||
      user?.location?.address ||
      "",
    isUserActive:
      typeof item?.isUserActive === "boolean" ? item.isUserActive : user?.isActive,
    pinOrder: item?.pinOrder,
    pinnedAt: item?.pinnedAt,
  };
};

export const TAB_CONFIG = {
  providers: {
    label: "Providers",
    idKey: "providerId",
    nameKey: "name",
    fetchRanking: fetchProviderRanking,
    fetchAvailablePage: fetchProviderAvailablePage,
    mapItem: toProviderItem,
  },
  businesses: {
    label: "Businesses",
    idKey: "businessOwnerId",
    nameKey: "businessName",
    fetchRanking: fetchBusinessRanking,
    fetchAvailablePage: fetchBusinessAvailablePage,
    mapItem: toBusinessItem,
  },
};
