import { escapeText } from './utils';

function supportedCharacterSet(characterSet) {
  const validCharacterSets = ['utf8', 'unicode', 'ansi', 'oem', 'mac'];

  return (validCharacterSets.indexOf(characterSet) > -1 && characterSet)
    || (Number(characterSet).toString() !== 'NaN' && `codepage is ${characterSet}`);
}

export default function formatSpecification(options) {
  if (!options) {
    options = {};
  }

  const formatSpecificationArr = [];

  if (options.fileExtension) {
    let fileFormat = options.fileExtension;

    if (fileFormat === 'xlsx') {
      fileFormat = 'ooxml';
    }

    if (fileFormat === 'csv') {
      fileFormat = 'txt';
    }

    if (fileFormat === 'htm') {
      fileFormat = 'html';
    }

    formatSpecificationArr.push(fileFormat);
  }

  if (options.headerRowNr || options.headerRowNr === 0) {
    formatSpecificationArr.push(`header is ${options.headerRowNr} lines`);
    // Should be included if header row is specified!
    formatSpecificationArr.push('embedded labels');
  }

  if (options.delimiter) {
    formatSpecificationArr.push(`delimiter is '${options.delimiter}'`);
  }

  if (options.characterSet && supportedCharacterSet(options.characterSet)) {
    formatSpecificationArr.push(supportedCharacterSet(options.characterSet));
  }

  if (options.srcTable) {
    formatSpecificationArr.push(`table is "${escapeText(options.srcTable)}"`);
  }

  if (options.noLabels) {
    formatSpecificationArr.push('no labels');
  }

  let formatSpecificationString = '';

  if (formatSpecificationArr.length > 0) {
    formatSpecificationString = `\n(${formatSpecificationArr.join(', ')})`;
  }

  return formatSpecificationString;
}
