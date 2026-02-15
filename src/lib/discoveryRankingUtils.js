export const MAX_PINNED_ITEMS = 100;

export const getItemId = (item, idKey) => {
  const value = item?.[idKey];
  return typeof value === "string" && value.trim() ? value : null;
};

export const uniqueById = (items, idKey) => {
  const seen = new Set();
  const next = [];
  for (const item of items || []) {
    const id = getItemId(item, idKey);
    if (!id || seen.has(id)) continue;
    seen.add(id);
    next.push(item);
  }
  return next;
};

export const reorderByIndexes = (items, fromIndex, toIndex) => {
  if (!Array.isArray(items)) return [];
  if (
    fromIndex < 0 ||
    toIndex < 0 ||
    fromIndex >= items.length ||
    toIndex >= items.length ||
    fromIndex === toIndex
  ) {
    return [...items];
  }
  const next = [...items];
  const [moved] = next.splice(fromIndex, 1);
  next.splice(toIndex, 0, moved);
  return next;
};

export const addPinnedItem = (
  pinnedItems,
  item,
  idKey,
  maxItems = MAX_PINNED_ITEMS
) => {
  const id = getItemId(item, idKey);
  if (!id) return { items: [...pinnedItems], reason: "invalid_id" };
  if (pinnedItems.length >= maxItems) {
    return { items: [...pinnedItems], reason: "max_limit" };
  }
  if (pinnedItems.some((entry) => getItemId(entry, idKey) === id)) {
    return { items: [...pinnedItems], reason: "duplicate" };
  }
  return { items: [...pinnedItems, item], reason: null };
};

export const removePinnedItem = (pinnedItems, id, idKey) =>
  (pinnedItems || []).filter((item) => getItemId(item, idKey) !== id);

export const toOrderedIds = (items, idKey) =>
  uniqueById(items || [], idKey)
    .map((item) => getItemId(item, idKey))
    .filter(Boolean);

export const isDirtyOrder = (currentItems, serverItems, idKey) => {
  const currentIds = toOrderedIds(currentItems, idKey);
  const serverIds = toOrderedIds(serverItems, idKey);
  if (currentIds.length !== serverIds.length) return true;
  for (let i = 0; i < currentIds.length; i += 1) {
    if (currentIds[i] !== serverIds[i]) return true;
  }
  return false;
};

export const clearPinnedItems = () => [];

export const resetPinnedItems = (serverItems) => [...(serverItems || [])];
