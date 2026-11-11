# Quick start

Research CSV Audit requires Node.js 20 or later and has no runtime dependencies.

## 1. Run the tests

```bash
node --test
```

The repository currently contains 9 tests covering CSV parsing, audit
calculations, Markdown and JSON rendering, and CLI file output.

## 2. Audit the sample data

```bash
node bin/research-csv-audit.js samples/experiment.csv
```

Without `--output`, the Markdown report is printed to standard output.

## 3. Save reports

```bash
node bin/research-csv-audit.js samples/experiment.csv --output reports/audit.md
node bin/research-csv-audit.js samples/experiment.csv --format json --output reports/audit.json
```

Expected summary:

```text
Audit complete: 10 rows, 3 numeric columns.
```

The sample identifies one missing value in `reaction_time_s` and one potential
IQR outlier in `yield_percent`.

## 4. Audit your own file

```bash
node bin/research-csv-audit.js path/to/experiment.csv --output reports/experiment-audit.md
```

For tab- or semicolon-delimited data, pass a one-character delimiter. In Bash:

```bash
node bin/research-csv-audit.js data.tsv --delimiter $'\t'
node bin/research-csv-audit.js data.csv --delimiter ";"
```

In PowerShell, write a tab as `` "`t" ``.

Review every flagged value in its experimental context before deciding whether
to correct, exclude, or retain it.

