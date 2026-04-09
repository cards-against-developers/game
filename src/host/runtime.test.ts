import assert from "node:assert/strict";
import test from "node:test";

import { ROUND_DEADLINE_POLL_INTERVAL_MS } from "./runtime.js";

test("round deadlines poll frequently enough to avoid visible reveal pauses", () => {
  assert.equal(ROUND_DEADLINE_POLL_INTERVAL_MS, 50);
});
