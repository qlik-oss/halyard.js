const qTypes = {
  timestamp: 'TS',
  date: 'D',
  time: 'T',
  interval: 'IV',
};

function isDimensionTypeMixed(dimension) {
  return dimension.qDimensionType === 'N' && dimension.qTags.length === 0;
}

function isDimensionTypeText(dimension) {
  return dimension.qDimensionType === 'D';
}

function isDimensionTypeTimestamp(dimension) {
  if (dimension.qDimensionType === 'T') {
    return true;
  }
  if (
    dimension.qDimensionType === 'N' &&
    dimension.qNumFormat.qType === qTypes.timestamp
  ) {
    return true;
  }
  return false;
}

function isDimensionTypeDate(dimension) {
  if (
    dimension.qDimensionType === 'N' &&
    dimension.qNumFormat.qType === qTypes.date
  ) {
    return true;
  }
  return false;
}

function isDimensionTypeTime(dimension) {
  if (
    dimension.qDimensionType === 'N' &&
    dimension.qNumFormat.qType === qTypes.time
  ) {
    return true;
  }
  return false;
}

function isDimensionTypeInterval(dimension) {
  if (
    dimension.qDimensionType === 'N' &&
    dimension.qNumFormat.qType === qTypes.interval
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
  const numericDimensionTypes = ['timestamp', 'interval', 'time', 'date', 'num'];
  dimensionType = dimensionType || '';
  return numericDimensionTypes.indexOf(dimensionType.toLowerCase()) > -1;
}
export function storeNumeric(field) {
  if (field.type === 'measure') {
    return true;
  }
  if (
    field.type === 'dimension' &&
    isNumericDimensionType(field.dimensionType)
  ) {
    return true;
  }
  return false;
}

export function checkIfFieldIsDual(field) {
  return field.type === 'num' && !field.isDual;
}

export function isCellDual(cell) {
  return cell.qText !== Number(cell.qNum).toString();
}
