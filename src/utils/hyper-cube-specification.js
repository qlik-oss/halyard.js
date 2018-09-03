/**
 * @constant
 * @type {{timestamp: string, date: string, time: string, interval: string}}
 */
const qTypes = {
  timestamp: 'TS',
  date: 'D',
  time: 'T',
  interval: 'IV',
};

/**
 * @constant
 * @type {{timestamp: string, text: string, numeric: string}}
 */
const qDimensionType = {
  timestamp: 'T',
  text: 'D',
  numeric: 'N',
};

export default {
  qTypes,
  qDimensionType,
};
