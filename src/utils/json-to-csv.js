function escapeValueContainingDelimiter(data, delimiter) {
  if (data && typeof data === 'string' && (data.indexOf(delimiter) > -1 || data.indexOf("\n") > -1)) {
    return `"${data.replace(/\"/g, "\"\"").replace(/\n/g, " ")}"`;
  }

  return data;
}

export function convert(data) {
  if (data instanceof Array === false) {
    data = [data];
  }

  let csv = '';
  const delimiter = ',';

  const headers = Object.keys(data[0]);

  csv = `${csv + headers.map(header => escapeValueContainingDelimiter(header, delimiter))
          .join(delimiter)}\n`;

  let fields = [];

  for (let i = 0; i < data.length; i += 1) {
    fields = [];

    for (let j = 0; j < headers.length; j += 1) {
      fields.push(escapeValueContainingDelimiter(data[i][headers[j]], delimiter));
    }

    csv = `${csv + fields.join(delimiter)}\n`;
  }

  csv = csv.slice(0, -('\n'.length));

  return csv;
}

export function isJson(data) {
  if (data instanceof Array) {
    if (data[0] && typeof data[0] === 'object') {
      return true;
    }
  }

  return false;
}
