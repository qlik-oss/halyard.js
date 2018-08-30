import hyperCubeSpecification from './hyper-cube-specification';

const DEFAULT_DELIMITER = ',';

/**
 * If a dimension has mixed types
 * @private
 * @param {object} dimension
 * @returns {boolean}
 */
function isDimensionTypeMixed(dimension) {
  return (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qTags.length === 0
  );
}

/**
 * Is dimension type a text
 * @private
 * @param {object} dimension
 * @returns {boolean}
 */
function isDimensionTypeText(dimension) {
  return dimension.qDimensionType === hyperCubeSpecification.qDimensionType.text;
}

/**
 * Is dimension type a timestamp
 * @private
 * @param {object} dimension
 * @returns {boolean}
 */
function isDimensionTypeTimestamp(dimension) {
  if (dimension.qDimensionType === hyperCubeSpecification.qDimensionType.timestamp) {
    return true;
  }
  if (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qNumFormat.qType === hyperCubeSpecification.qTypes.timestamp
  ) {
    return true;
  }
  return false;
}

/**
 * Is dimension type a date
 * @private
 * @param {object} dimension
 * @returns {boolean}
 */
function isDimensionTypeDate(dimension) {
  if (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qNumFormat.qType === hyperCubeSpecification.qTypes.date
  ) {
    return true;
  }
  return false;
}

/**
 * Is dimension type a time
 * @private
 * @param {object} dimension
 * @returns {boolean}
 */
function isDimensionTypeTime(dimension) {
  if (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qNumFormat.qType === hyperCubeSpecification.qTypes.time
  ) {
    return true;
  }
  return false;
}

/**
 * Is dimension type an interval
 * @private
 * @param {object} dimension
 * @returns {boolean}
 */
function isDimensionTypeInterval(dimension) {
  if (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qNumFormat.qType === hyperCubeSpecification.qTypes.interval
  ) {
    return true;
  }
  return false;
}

/**
 * Get dimension type
 * @private
 * @param {object} dimension
 * @returns {string}
 */
export function getDimensionType(dimension) {
  if (isDimensionTypeText(dimension)) {
    return 'text';
  }
  if (isDimensionTypeMixed(dimension)) {
    return 'mixed';
  }
  if (isDimensionTypeTimestamp(dimension)) {
    return 'timestamp';
  }
  if (isDimensionTypeTime(dimension)) {
    return 'time';
  }
  if (isDimensionTypeDate(dimension)) {
    return 'date';
  }
  if (isDimensionTypeInterval(dimension)) {
    return 'interval';
  }
  return 'num';
}

/**
 * Is numeric dimension type
 * @private
 * @param {string} dimensionType
 * @returns {boolean}
 */
function isNumericDimensionType(dimensionType) {
  const numericDimensionTypes = [
    'timestamp',
    'interval',
    'time',
    'date',
    'num',
  ];
  dimensionType = dimensionType || '';
  return numericDimensionTypes.indexOf(dimensionType.toLowerCase()) > -1;
}

/**
 * Is field numeric
 * @private
 * @param {object} field
 * @returns {boolean}
 */
function storeNumeric(field) {
  if (field.type === 'measure') {
    return true;
  }
  if (
    field.type === 'dimension' && isNumericDimensionType(field.dimensionType)
  ) {
    return true;
  }
  return false;
}

/**
 * Check if field is a dual value
 * @private
 * @param {object} field
 * @returns {boolean}
 */
export function checkIfFieldIsDual(field) {
  return field.type === 'dimension' && field.dimensionType === 'num';
}

/**
 * Has cell a dual value
 * @private
 * @param {object} cell
 * @param {object} field
 * @returns {boolean}
 */
export function isCellDual(cell, field) {
  return checkIfFieldIsDual(field) && cell.qText !== Number(cell.qNum).toString();
}

/**
 * Escape string containing delimiter
 * @private
 * @param {string} string
 * @param {string} delimiter
 * @returns {string}
 */
function escapeStringContainingDelimiter(string, delimiter) {
  if (string.indexOf(delimiter) > -1 || string.indexOf('\n') > -1) {
    return `'${string.replace(/'/g, "''").replace(/\n/g, ' ')}'`;
  }
  return string;
}

/**
 * Get the numeric from cell value
 * @private
 * @param {object} cell
 * @returns {number}
 */
function getNumericCellValue(cell) {
  return cell.qNum;
}

/**
 * Get the text from a cell value
 * @private
 * @param {object} cell
 * @returns {string}
 */
function getTextCellValue(cell) {
  return escapeStringContainingDelimiter(cell.qText, DEFAULT_DELIMITER);
}

/**
 * Get the value of a cell
 * @private
 * @param {object} cell
 * @param {object} field
 * @returns {(string|number)}
 */
export function getCellValue(cell, field) {
  if (storeNumeric(field)) {
    return getNumericCellValue(cell);
  }
  return getTextCellValue(cell);
}

/**
 * Get dual data row
 * @private
 * @param {object} cell
 * @returns {string}
 */
export function getDualDataRow(cell) {
  return `${cell.qNum}${DEFAULT_DELIMITER}${escapeStringContainingDelimiter(cell.qText, DEFAULT_DELIMITER)}`;
}

/**
 * Get dual headers from a field
 * @private
 * @param {object} field
 * @returns {string}
 */
export function getDualHeadersForField(field) {
  return `${field.name}${DEFAULT_DELIMITER}${field.name}_qText}`;
}
