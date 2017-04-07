export function folderPath(path) {
  let folderPathMatch = path.match(/^(.*)(\\.*\..*$|\\.*)$/);

  if (folderPathMatch) {
    return folderPathMatch[1];
  }

    // Unix file path check
  folderPathMatch = path.match(/^(.*)(\/.*\..*$|\/.*)$/);

  return folderPathMatch && folderPathMatch[1];
}

export function fileName(path) {
  let fileNameMatch = path.match(/^.*\\(.*\..*|.*)$/);

  if (fileNameMatch) {
    return fileNameMatch[1];
  }

  fileNameMatch = path.match(/^.*\/(.*\..*|.*)$/);

  return fileNameMatch && fileNameMatch[1];
}

export function fileExtension(path) {
  const fileExtensionMatch = path.match(/^.*\.(.*)$/);

  return fileExtensionMatch && fileExtensionMatch[1];
}

export function escapeText(text) {
  return text.replace(/"/g, '""');
}

export function uniqueName() {
  /* eslint no-bitwise: ["off"] */
  /* eslint no-mixed-operators: ["off"] */

  return 'xxxxx-8xxxx-yxxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

export function validFieldType(type) {
  const validFileTypes = ['time', 'timestamp', 'date'];

  type = type || '';

  return validFileTypes.indexOf(type.toLowerCase()) > -1;
}

export function indentation() {
  return '  ';
}

export function getFieldName(field) {
  return field.name || field.src;
}
