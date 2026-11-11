#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { basename, dirname, resolve } from "node:path";
import { auditTable, renderMarkdown } from "../src/audit.js";
import { parseCsv } from "../src/csv.js";

function usage() {
  return `Research CSV Audit

Usage:
  node bin/research-csv-audit.js <input.csv> [options]

Options:
  --delimiter <char>  CSV delimiter (default: comma)
  --output <path>     Write the Markdown report to a file
  --help              Show this help message`;
}

function parseArguments(argumentsList) {
  const options = { delimiter: ",", output: null, input: null };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--help") {
      options.help = true;
    } else if (argument === "--delimiter") {
      options.delimiter = argumentsList[++index];
      if (!options.delimiter) throw new Error("--delimiter requires a value");
    } else if (argument === "--output") {
      options.output = argumentsList[++index];
      if (!options.output) throw new Error("--output requires a path");
    } else if (argument.startsWith("--")) {
      throw new Error(`Unknown option: ${argument}`);
    } else if (options.input === null) {
      options.input = argument;
    } else {
      throw new Error(`Unexpected argument: ${argument}`);
    }
  }

  return options;
}

async function main() {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    console.log(usage());
    return;
  }
  if (!options.input) {
    throw new Error(`Input CSV is required.\n\n${usage()}`);
  }

  const inputPath = resolve(options.input);
  const csvText = await readFile(inputPath, "utf8");
  const { headers, rows } = parseCsv(csvText, options.delimiter);
  const audit = auditTable(headers, rows);
  const report = renderMarkdown(audit, basename(inputPath));

  if (options.output) {
    const outputPath = resolve(options.output);
    await mkdir(dirname(outputPath), { recursive: true });
    await writeFile(outputPath, report, "utf8");
    console.log(`Audit complete: ${audit.rowCount} rows, ${audit.numericColumnCount} numeric columns.`);
    console.log(`Report written to ${outputPath}`);
  } else {
    console.log(report);
  }
}

main().catch((error) => {
  console.error(`Error: ${error.message}`);
  process.exitCode = 1;
});

