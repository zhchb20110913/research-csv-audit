import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { execFile } from "node:child_process";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

test("CLI writes a Markdown audit report", async () => {
  const directory = await mkdtemp(join(tmpdir(), "research-csv-audit-"));
  const inputPath = join(directory, "input.csv");
  const outputPath = join(directory, "audit.md");

  try {
    await writeFile(inputPath, "id,value\nA,1\nB,2\n", "utf8");
    const cliPath = resolve("bin/research-csv-audit.js");
    const { stdout } = await execFileAsync(process.execPath, [cliPath, inputPath, "--output", outputPath]);
    const report = await readFile(outputPath, "utf8");

    assert.match(stdout, /Audit complete/);
    assert.match(report, /\| value \| 2 \| 0 \|/);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

test("CLI writes a JSON audit report", async () => {
  const directory = await mkdtemp(join(tmpdir(), "research-csv-audit-json-"));
  const inputPath = join(directory, "input.csv");
  const outputPath = join(directory, "audit.json");

  try {
    await writeFile(inputPath, "id,value\nA,1\nB,2\n", "utf8");
    const cliPath = resolve("bin/research-csv-audit.js");
    await execFileAsync(process.execPath, [
      cliPath,
      inputPath,
      "--format",
      "json",
      "--output",
      outputPath,
    ]);
    const report = JSON.parse(await readFile(outputPath, "utf8"));

    assert.equal(report.source, "input.csv");
    assert.equal(report.numericColumns[0].mean, 1.5);
  } finally {
    await rm(directory, { recursive: true, force: true });
  }
});

