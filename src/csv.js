export function parseCsv(text, delimiter = ",") {
  if (typeof text !== "string") {
    throw new TypeError("CSV input must be a string");
  }
  if (delimiter.length !== 1) {
    throw new Error("Delimiter must be exactly one character");
  }

  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];

    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === delimiter) {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (character !== "\r") {
      field += character;
    }
  }

  if (quoted) {
    throw new Error("CSV contains an unclosed quoted field");
  }
  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  while (rows.length > 0 && rows.at(-1).every((value) => value.trim() === "")) {
    rows.pop();
  }
  if (rows.length === 0) {
    throw new Error("CSV file is empty");
  }

  const headers = rows[0].map((value, index) => {
    const header = value.replace(/^\uFEFF/, "").trim();
    if (header === "") {
      throw new Error(`Column ${index + 1} has an empty header`);
    }
    return header;
  });

  if (new Set(headers).size !== headers.length) {
    throw new Error("CSV headers must be unique");
  }

  const dataRows = rows.slice(1).map((values, rowIndex) => {
    if (values.length > headers.length) {
      throw new Error(`Row ${rowIndex + 2} has more fields than the header`);
    }
    return headers.map((_, columnIndex) => (values[columnIndex] ?? "").trim());
  });

  return { headers, rows: dataRows };
}

