# Audit metrics

## Numeric column detection

A column is included when it contains at least one non-missing value and every
non-missing value converts to a finite JavaScript number. Identifier and group
columns therefore remain outside the numeric summary.

Recognized missing markers, matched case-insensitively, are:

```text
empty cell, NA, N/A, null, NaN, -
```

## Descriptive statistics

For each numeric column, the report includes:

- valid and missing counts;
- arithmetic mean;
- median;
- sample standard deviation with denominator `n - 1`;
- minimum and maximum;
- first and third quartiles.

The median and quartiles use linear interpolation at position
`(n - 1) × probability` in the sorted values.

## IQR outlier screen

The interquartile range is:

```text
IQR = Q3 - Q1
```

The lower and upper screening fences are:

```text
lower = Q1 - 1.5 × IQR
upper = Q3 + 1.5 × IQR
```

Values outside those fences are counted and included in the JSON report. The
screen is intentionally conservative and does not mutate the dataset. A flagged
observation can be a measurement error, a data-entry issue, or a scientifically
important result.

## Precision

Markdown display values are rounded to at most four decimal places. JSON keeps
the underlying JavaScript number so downstream programs can choose their own
display precision.

