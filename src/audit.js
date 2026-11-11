const DEFAULT_MISSING_MARKERS = new Set(["", "na", "n/a", "null", "nan", "-"]);

function isMissing(value, missingMarkers) {
  return missingMarkers.has(String(value).trim().toLowerCase());
}

function quantile(sortedValues, probability) {
  if (sortedValues.length === 1) {
    return sortedValues[0];
  }
  const position = (sortedValues.length - 1) * probability;
  const lowerIndex = Math.floor(position);
  const upperIndex = Math.ceil(position);
  const weight = position - lowerIndex;
  return sortedValues[lowerIndex] * (1 - weight) + sortedValues[upperIndex] * weight;
}

function sampleStandardDeviation(values, mean) {
  if (values.length < 2) {
    return null;
  }
  const squaredDifferences = values.map((value) => (value - mean) ** 2);
  const variance = squaredDifferences.reduce((total, value) => total + value, 0) / (values.length - 1);
  return Math.sqrt(variance);
}

function summarizeNumbers(values) {
  const sorted = [...values].sort((left, right) => left - right);
  const mean = sorted.reduce((total, value) => total + value, 0) / sorted.length;
  const q1 = quantile(sorted, 0.25);
  const median = quantile(sorted, 0.5);
  const q3 = quantile(sorted, 0.75);
  const iqr = q3 - q1;
  const lowerFence = q1 - 1.5 * iqr;
  const upperFence = q3 + 1.5 * iqr;
  const outliers = sorted.filter((value) => value < lowerFence || value > upperFence);

  return {
    mean,
    median,
    standardDeviation: sampleStandardDeviation(sorted, mean),
    minimum: sorted[0],
    q1,
    q3,
    maximum: sorted.at(-1),
    lowerFence,
    upperFence,
    outlierCount: outliers.length,
    outliers,
  };
}

export function auditTable(headers, rows, options = {}) {
  const missingMarkers = new Set(options.missingMarkers ?? DEFAULT_MISSING_MARKERS);
  const numericColumns = [];

  headers.forEach((name, columnIndex) => {
    const rawValues = rows.map((row) => row[columnIndex] ?? "");
    const presentValues = rawValues.filter((value) => !isMissing(value, missingMarkers));
    const numericValues = presentValues.map(Number);

    if (presentValues.length === 0 || numericValues.some((value) => !Number.isFinite(value))) {
      return;
    }

    numericColumns.push({
      name,
      validCount: numericValues.length,
      missingCount: rawValues.length - presentValues.length,
      ...summarizeNumbers(numericValues),
    });
  });

  return {
    rowCount: rows.length,
    columnCount: headers.length,
    numericColumnCount: numericColumns.length,
    numericColumns,
  };
}

function formatNumber(value) {
  if (value === null) {
    return "—";
  }
  return Number(value.toFixed(4)).toString();
}

function escapeMarkdown(value) {
  return String(value).replaceAll("|", "\\|");
}

export function renderMarkdown(audit, sourceName = "dataset.csv") {
  const lines = [
    "# Research CSV Audit Report",
    "",
    `- Source: \`${escapeMarkdown(sourceName)}\``,
    `- Data rows: ${audit.rowCount}`,
    `- Total columns: ${audit.columnCount}`,
    `- Numeric columns: ${audit.numericColumnCount}`,
    "",
  ];

  if (audit.numericColumns.length === 0) {
    lines.push("No numeric columns were detected.", "");
    return lines.join("\n");
  }

  lines.push(
    "| Column | Valid | Missing | Mean | Median | Std. dev. | Min | Q1 | Q3 | Max | IQR outliers |",
    "| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |",
  );

  for (const column of audit.numericColumns) {
    lines.push(
      `| ${escapeMarkdown(column.name)} | ${column.validCount} | ${column.missingCount} | ${formatNumber(column.mean)} | ${formatNumber(column.median)} | ${formatNumber(column.standardDeviation)} | ${formatNumber(column.minimum)} | ${formatNumber(column.q1)} | ${formatNumber(column.q3)} | ${formatNumber(column.maximum)} | ${column.outlierCount} |`,
    );
  }

  lines.push(
    "",
    "> Potential outliers use the 1.5 × IQR rule. Review them in context before excluding any observation.",
    "",
  );
  return lines.join("\n");
}

