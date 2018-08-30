/**
 * Get folder path from file path
 * @private
 * @param {string} path
 * @returns {string}
 */
export function folderPath(path) {
  let folderPathMatch = path.match(/^(.*)(\\.*\..*$|\\.*)$/);

  if (folderPathMatch) {
    return folderPathMatch[1];
  }

  // Unix file path check
  folderPathMatch = path.match(/^(.*)(\/.*\..*$|\/.*)$/);

  return folderPathMatch && folderPathMatch[1];
}

/**
 * Get file name from file path
 * @private
 * @param {string} path
 * @returns {string}
 */
export function fileName(path) {
  let fileNameMatch = path.match(/^.*\\(.*\..*|.*)$/);

  if (fileNameMatch) {
    return fileNameMatch[1];
  }

  fileNameMatch = path.match(/^.*\/(.*\..*|.*)$/);

  return fileNameMatch && fileNameMatch[1];
}

/**
 * Get file extension from file path
 * @private
 * @param {string} path
 * @returns {string}
 */
export function fileExtension(path) {
  const fileExtensionMatch = path.match(/^.*\.(.*)$/);

  return fileExtensionMatch && fileExtensionMatch[1];
}

/**
 * Escape text with double quotes
 * @private
 * @param {string} text
 * @returns {string}
 */
export function escapeText(text) {
  return text.replace(/"/g, '""');
}

/**
 * Get a unique name
 * @private
 * @returns {string}
 */
export function uniqueName() {
  /* eslint no-bitwise: ["off"] */
  /* eslint no-mixed-operators: ["off"] */

  return 'xxxxx-8xxxx-yxxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/**
 * Validate the field type
 * @private
 * @param {string} type
 * @returns {boolean}
 */
export function validFieldType(type) {
  const validFieldTypes = ['time', 'timestamp', 'date', 'interval'];

  type = type || '';

  return validFieldTypes.indexOf(type.toLowerCase()) > -1;
}

/**
 * Get indentation characters
 * @private
 * @returns {string}
 */
export function indentation() {
  return '  ';
}

/**
 * Get the field name
 * @private
 * @param {object }field
 * @returns {string}
 */
export function getFieldName(field) {
  return field.name || field.src;
}
