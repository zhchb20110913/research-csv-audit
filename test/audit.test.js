import test from "node:test";
import assert from "node:assert/strict";
import { auditTable, renderMarkdown } from "../src/audit.js";

test("detects numeric columns, missing values, and IQR outliers", () => {
  const headers = ["sample", "measurement"];
  const rows = [
    ["A", "10"],
    ["B", "10"],
    ["C", "11"],
    ["D", "11"],
    ["E", "12"],
    ["F", "100"],
    ["G", ""],
  ];

  const result = auditTable(headers, rows);
  assert.equal(result.numericColumnCount, 1);
  assert.equal(result.numericColumns[0].name, "measurement");
  assert.equal(result.numericColumns[0].missingCount, 1);
  assert.deepEqual(result.numericColumns[0].outliers, [100]);
});

test("uses sample standard deviation", () => {
  const result = auditTable(["value"], [["1"], ["2"], ["3"]]);
  assert.equal(result.numericColumns[0].standardDeviation, 1);
});

test("renders a readable Markdown report", () => {
  const result = auditTable(["value"], [["1"], ["2"], [""]]);
  const report = renderMarkdown(result, "experiment.csv");

  assert.match(report, /Research CSV Audit Report/);
  assert.match(report, /experiment\.csv/);
  assert.match(report, /\| value \| 2 \| 1 \|/);
});

