import hyperCubeSpecification from './hyper-cube-specification';

const DEFAULT_DELIMITER = ',';

function isDimensionTypeMixed(dimension) {
  return (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qTags.length === 0
  );
}

function isDimensionTypeText(dimension) {
  return dimension.qDimensionType === hyperCubeSpecification.qDimensionType.text;
}

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

function isDimensionTypeDate(dimension) {
  if (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qNumFormat.qType === hyperCubeSpecification.qTypes.date
  ) {
    return true;
  }
  return false;
}

function isDimensionTypeTime(dimension) {
  if (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qNumFormat.qType === hyperCubeSpecification.qTypes.time
  ) {
    return true;
  }
  return false;
}

function isDimensionTypeInterval(dimension) {
  if (
    dimension.qDimensionType === hyperCubeSpecification.qDimensionType.numeric
    && dimension.qNumFormat.qType === hyperCubeSpecification.qTypes.interval
  ) {
    return true;
  }
  return false;
}

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

export function checkIfFieldIsDual(field) {
  return field.type === 'dimension' && field.dimensionType === 'num';
}

export function isCellDual(cell, field) {
  return checkIfFieldIsDual(field) && cell.qText !== Number(cell.qNum).toString();
}

function escapeStringContainingDelimiter(string, delimiter) {
  if (string.indexOf(delimiter) > -1 || string.indexOf('\n') > -1) {
    return `'${string.replace(/'/g, "''").replace(/\n/g, ' ')}'`;
  }
  return string;
}

function getNumericCellValue(cell) {
  return cell.qNum;
}

function getTextCellValue(cell) {
  return escapeStringContainingDelimiter(cell.qText, DEFAULT_DELIMITER);
}

export function getCellValue(cell, field) {
  if (storeNumeric(field)) {
    return getNumericCellValue(cell);
  }
  return getTextCellValue(cell);
}

export function getDualDataRow(cell) {
  return `${cell.qNum}${DEFAULT_DELIMITER}${escapeStringContainingDelimiter(cell.qText, DEFAULT_DELIMITER)}`;
}

export function getDualHeadersForField(field) {
  return `${field.name}${DEFAULT_DELIMITER}${field.name}_qText}`;
}
