# CLI reference

## Usage

```text
node bin/research-csv-audit.js <input.csv> [options]
```

## Options

| Option | Value | Default | Purpose |
|---|---|---|---|
| `--delimiter` | one character | `,` | parse a non-comma-delimited file |
| `--format` | `markdown` or `json` | `markdown` | choose report serialization |
| `--output` | file path | none | write to a file instead of standard output |
| `--help` | none | — | print command help |

Parent directories for `--output` are created automatically.

## Examples

```bash
# Print Markdown
node bin/research-csv-audit.js samples/experiment.csv

# Save Markdown
node bin/research-csv-audit.js samples/experiment.csv --output reports/audit.md

# Save JSON
node bin/research-csv-audit.js samples/experiment.csv --format json --output reports/audit.json

# Use a semicolon delimiter
node bin/research-csv-audit.js experiment.csv --delimiter ";"
```

## Exit status

| Code | Meaning |
|---:|---|
| `0` | audit completed or help was displayed |
| `1` | invalid arguments, unreadable input, or invalid CSV |

Errors are written to standard error with an `Error:` prefix.

