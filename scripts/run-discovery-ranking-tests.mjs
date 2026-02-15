import assert from "node:assert/strict";
import {
  addPinnedItem,
  clearPinnedItems,
  isDirtyOrder,
  removePinnedItem,
  reorderByIndexes,
  resetPinnedItems,
  toOrderedIds,
} from "../src/lib/discoveryRankingUtils.js";
import { saveDiscoveryRanking } from "../src/lib/discoveryRankingService.js";
import { sendBroadcastNotification } from "../src/lib/broadcastNotificationService.js";
import {
  ALL_USER_TYPES,
  canSendBroadcast,
  createInitialBroadcastState,
  isSendDisabled,
  mapInvalidUserTypes,
  toBroadcastPayload,
  validateBroadcastForm,
} from "../src/lib/broadcastNotificationUtils.js";

const tests = [];

const test = (name, fn) => tests.push({ name, fn });

test("unit: reorder logic", () => {
  const items = [
    { providerId: "a" },
    { providerId: "b" },
    { providerId: "c" },
  ];
  const reordered = reorderByIndexes(items, 0, 2);
  assert.deepEqual(toOrderedIds(reordered, "providerId"), ["b", "c", "a"]);
});

test("unit: add/remove logic with duplicate prevention", () => {
  const existing = [{ providerId: "a" }];
  const duplicateResult = addPinnedItem(existing, { providerId: "a" }, "providerId");
  assert.equal(duplicateResult.reason, "duplicate");
  const addResult = addPinnedItem(existing, { providerId: "b" }, "providerId");
  assert.equal(addResult.reason, null);
  assert.deepEqual(toOrderedIds(addResult.items, "providerId"), ["a", "b"]);
  const removed = removePinnedItem(addResult.items, "a", "providerId");
  assert.deepEqual(toOrderedIds(removed, "providerId"), ["b"]);
});

test("unit: dirty state detection", () => {
  const server = [{ providerId: "a" }, { providerId: "b" }];
  const same = [{ providerId: "a" }, { providerId: "b" }];
  const changed = [{ providerId: "b" }, { providerId: "a" }];
  assert.equal(isDirtyOrder(same, server, "providerId"), false);
  assert.equal(isDirtyOrder(changed, server, "providerId"), true);
});

test("unit: payload generation", () => {
  const items = [
    { businessOwnerId: "x" },
    { businessOwnerId: "x" },
    { businessOwnerId: "y" },
  ];
  assert.deepEqual(toOrderedIds(items, "businessOwnerId"), ["x", "y"]);
});

test("unit: clear flow", () => {
  const cleared = clearPinnedItems();
  assert.deepEqual(cleared, []);
});

test("unit: reset flow", () => {
  const server = [{ providerId: "a" }, { providerId: "b" }];
  const reset = resetPinnedItems(server);
  assert.deepEqual(reset, server);
  assert.notEqual(reset, server);
});

test("integration: save flow", async () => {
  const calls = [];
  const result = await saveDiscoveryRanking({
    kind: "providers",
    idKey: "providerId",
    pinnedItems: [{ providerId: "p1" }, { providerId: "p2" }],
    saveProviders: async (orderedIds) => {
      calls.push(orderedIds);
    },
  });
  assert.deepEqual(calls, [["p1", "p2"]]);
  assert.deepEqual(result.orderedIds, ["p1", "p2"]);
});

test("integration: error flow with invalidIds", async () => {
  let failed = false;
  try {
    await saveDiscoveryRanking({
      kind: "businesses",
      idKey: "businessOwnerId",
      pinnedItems: [{ businessOwnerId: "b1" }, { businessOwnerId: "b2" }],
      saveBusinesses: async () => {
        const error = new Error("Bad Request");
        error.response = {
          status: 400,
          data: { message: "Invalid IDs", invalidIds: ["b2"] },
        };
        throw error;
      },
    });
  } catch (error) {
    failed = true;
    assert.equal(error.message, "Invalid IDs");
    assert.equal(error.status, 400);
    assert.deepEqual(error.invalidIds, ["b2"]);
  }
  assert.equal(failed, true);
});

test("broadcast: submit success with all user types", async () => {
  const form = createInitialBroadcastState();
  const calls = [];
  const response = {
    targetedUsers: 100,
    notificationsCreated: 100,
    userTypes: [...ALL_USER_TYPES],
    push: { attempted: true, sent: 80, failed: 20, tokens: 100 },
  };
  const result = await sendBroadcastNotification({
    form,
    send: async (payload) => {
      calls.push(payload);
      return response;
    },
  });
  assert.equal(calls.length, 1);
  assert.deepEqual(calls[0].userTypes, ALL_USER_TYPES);
  assert.deepEqual(result.result, response);
});

test("broadcast: submit success with one user type", async () => {
  const form = {
    ...createInitialBroadcastState(),
    userTypes: ["provider"],
    title: "Hi providers",
    body: "Update",
  };
  const calls = [];
  await sendBroadcastNotification({
    form,
    send: async (payload) => {
      calls.push(payload);
      return { targetedUsers: 5, notificationsCreated: 5, userTypes: ["provider"] };
    },
  });
  assert.deepEqual(calls[0].userTypes, ["provider"]);
});

test("broadcast: validation empty title/body/userTypes", () => {
  const validation = validateBroadcastForm({ title: "", body: "", userTypes: [] });
  assert.equal(validation.valid, false);
  assert.equal(Boolean(validation.errors.title), true);
  assert.equal(Boolean(validation.errors.body), true);
  assert.equal(Boolean(validation.errors.userTypes), true);
});

test("broadcast: api error mapping includes invalidUserTypes", () => {
  const error = new Error("bad");
  error.response = {
    data: { invalidUserTypes: ["foo", "bar"] },
  };
  assert.deepEqual(mapInvalidUserTypes(error), ["foo", "bar"]);
});

test("broadcast: permission denied utility", () => {
  assert.equal(canSendBroadcast({ canManageSettings: false }), false);
  assert.equal(canSendBroadcast({ canManageSettings: true }), true);
});

test("broadcast: send button disabled while loading", () => {
  assert.equal(isSendDisabled(true), true);
  assert.equal(isSendDisabled(false), false);
});

test("broadcast: payload mapping trims and maps values", () => {
  const payload = toBroadcastPayload({
    title: "  Hello ",
    body: "  Message ",
    userTypes: ["user"],
    includeInactive: 0,
    sendPush: 1,
  });
  assert.equal(payload.title, "Hello");
  assert.equal(payload.body, "Message");
  assert.deepEqual(payload.userTypes, ["user"]);
  assert.equal(payload.includeInactive, false);
  assert.equal(payload.sendPush, true);
});

const run = async () => {
  for (const entry of tests) {
    try {
      await entry.fn();
      console.log(`PASS: ${entry.name}`);
    } catch (error) {
      console.error(`FAIL: ${entry.name}`);
      console.error(error);
      process.exitCode = 1;
      return;
    }
  }
  console.log(`PASS: ${tests.length} tests`);
};

await run();
