import assert from "node:assert/strict";
import test from "node:test";
import { ApiError, asObject, requiredString, validSessionToken } from "../lib/api-validation";
import {
  formatIndiaDate,
  getActiveChapterKey,
  isChapterAvailable,
  isValidAnswer,
  normalizeChapterKey,
  previousChapterKey,
} from "../lib/chapters";

test("chapter schedule uses India calendar boundaries", () => {
  assert.equal(formatIndiaDate(new Date("2026-09-19T18:29:59.000Z")), "2026-09-19");
  assert.equal(formatIndiaDate(new Date("2026-09-19T18:30:00.000Z")), "2026-09-20");
  assert.equal(getActiveChapterKey("2026-09-19"), "prelude");
  assert.equal(getActiveChapterKey("2026-09-20"), "sweet");
  assert.equal(getActiveChapterKey("2026-09-23"), "forever");
});

test("legacy response keys normalize to canonical chapter keys", () => {
  assert.equal(normalizeChapterKey("incident"), "sweet");
  assert.equal(normalizeChapterKey("sleepy"), "wild");
  assert.equal(normalizeChapterKey("interrupter"), "fierce");
  assert.equal(normalizeChapterKey("cover-up"), "forever");
  assert.equal(normalizeChapterKey("unknown"), null);
});

test("chapter access follows date and previous chapter order", () => {
  assert.equal(isChapterAvailable("sweet", "prelude"), false);
  assert.equal(isChapterAvailable("sweet", "wild"), true);
  assert.equal(isChapterAvailable("fierce", "wild"), false);
  assert.equal(previousChapterKey("sweet"), null);
  assert.equal(previousChapterKey("forever"), "fierce");
});

test("answers are constrained to their chapter", () => {
  assert.equal(isValidAnswer("sweet", "A2"), true);
  assert.equal(isValidAnswer("sweet", "B2"), false);
  assert.equal(isValidAnswer("forever", "D3"), true);
  assert.equal(isValidAnswer("forever", "D4"), false);
});

test("API validation rejects malformed or oversized input", () => {
  assert.deepEqual(asObject({ value: "ok" }), { value: "ok" });
  assert.throws(() => asObject([]), ApiError);
  assert.equal(requiredString({ value: " hello " }, "value", 10), "hello");
  assert.throws(() => requiredString({ value: "too long" }, "value", 3), ApiError);
  assert.equal(validSessionToken("s_12345678"), "s_12345678");
  assert.throws(() => validSessionToken("short"), ApiError);
});
