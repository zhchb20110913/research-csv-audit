import test from "node:test";
import assert from "node:assert/strict";
import { parseCsv } from "../src/csv.js";

test("parses quoted commas and escaped quotes", () => {
  const result = parseCsv('sample,value,note\nA,1.2,"stable, repeated"\nB,2.4,"said ""ok"""\n');

  assert.deepEqual(result.headers, ["sample", "value", "note"]);
  assert.deepEqual(result.rows, [
    ["A", "1.2", "stable, repeated"],
    ["B", "2.4", 'said "ok"'],
  ]);
});

test("pads missing trailing fields", () => {
  const result = parseCsv("a,b,c\n1,2\n");
  assert.deepEqual(result.rows, [["1", "2", ""]]);
});

test("rejects duplicate headers", () => {
  assert.throws(() => parseCsv("value,value\n1,2\n"), /headers must be unique/);
});

