import Table from './table';
import { validFieldType } from './utils/utils';
import * as HyperCubeUtils from './utils/hyper-cube-utils';

class HyperCube {
  constructor(hyperCubeLayout, options) {
    this.items = [];
    this.fields = [];
    this.hyperCubeLayout = this.validateHyperCubeLayout(hyperCubeLayout);

    options = options || {};

    if (typeof options === 'string') {
      this.name = options;
      options = {};
    } else {
      this.name = options.name;
      if (options.section) {
        this.section = options.section;
      }
    }

    this.parseHyperCubeLayout(options);

    this.options = options;
  }

  validateHyperCubeLayout(hyperCubeLayout) {
    if (!hyperCubeLayout) { throw new Error('Hyper cube layout is undefined'); }
    if (!hyperCubeLayout.qDimensionInfo) { throw new Error('qDimensionInfo is undefined'); }
    if (!hyperCubeLayout.qMeasureInfo) { throw new Error('qMeasureInfo is undefined'); }
    if (hyperCubeLayout.qMode === 'P') { throw new Error('Cannot add hyper cube in pivot mode, qMode:P(DATA_MODE_PIVOT) is not supported'); }
    if (hyperCubeLayout.qMode === 'K') { throw new Error('Cannot add hyper cube in stacked mode, qMode:K(DATA_MODE_PIVOT_STACK) is not supported'); }
    if (hyperCubeLayout.qMode === 'S') {
      this.validateDataPages(hyperCubeLayout.qDataPages);
      this.validateDataPagesCoverage(hyperCubeLayout.qDataPages, hyperCubeLayout);
      return hyperCubeLayout;
    }
    throw new Error('HyperCubeLayout is not valid');
  }

  validateDataPages(dataPages) {
    if (!dataPages) {
      throw new Error('qDataPages are undefined');
    }

    if (dataPages[0].qArea && dataPages[0].qArea.qTop > 0) {
      throw new Error('qDataPages first page should start at qTop: 0.');
    }
  }

  validateDataPagesCoverage(dataPages, hyperCubeLayout) {
    let qHeight = 0;

    dataPages.forEach((dataPage) => {
      this.validateQMatrix(dataPage);
      this.validateQArea(dataPage, hyperCubeLayout, qHeight);
      qHeight += dataPage.qArea.qHeight;
    }, this);

    if (hyperCubeLayout.qSize.qcy !== qHeight) {
      throw new Error('qDataPages are missing pages.');
    }
  }

  validateQMatrix(dataPage) {
    if (!dataPage.qMatrix) {
      throw new Error('qMatrix of qDataPages are undefined');
    }
    if (dataPage.qMatrix.length === 0) {
      throw new Error('qDataPages are empty');
    }
  }

  validateQArea(dataPage, hyperCubeLayout, qHeight) {
    if (!dataPage.qArea) {
      throw new Error('qArea of qDataPages are undefined');
    }
    if (dataPage.qArea.qLeft > 0) {
      throw new Error('qDataPages have data pages that\'s not of full qWidth.');
    }
    if (dataPage.qArea.qWidth < hyperCubeLayout.qSize.qcx) {
      throw new Error('qDataPages have data pages that\'s not of full qWidth.');
    }
    if (dataPage.qArea.qTop < qHeight) {
      throw new Error('qDataPages have overlapping data pages.');
    }
    if (dataPage.qArea.qTop > qHeight) {
      throw new Error('qDataPages are missing pages.');
    }
  }

  parseHyperCubeLayout() {
    const that = this;
    that.fields = that.getFieldsFromHyperCubeLayout();
    that.data = that.getDataFromHyperCubeLayout();
    const inlineData = `${that.fields
      .map(field => field.name)
      .join(',')}\n${this.data}`;
    let hasDual = false;
    that.fields.forEach((field) => {
      if (field.isDual) {
        hasDual = true;
        that.items.push(that.getMapTableForDualField(field));
      }
    });
    const options = {
      name: that.name,
      fields: that.getFieldsDefinition(that.fields),
    };
    if (that.section && !hasDual) {
      options.section = that.section;
    }
    that.items.push(new Table(inlineData, options));
  }

  getFieldsDefinition(fields) {
    return fields.map((field) => {
      const mappedField = { name: field.name };
      if (validFieldType(field.dimensionType)) {
        mappedField.type = field.dimensionType;
        mappedField.displayFormat = field.displayFormat;
      }
      if (field.isDual) {
        mappedField.expr = `Dual(ApplyMap('MapDual__${field.name}', "${field.name}"), "${field.name}")`;
      } else {
        mappedField.src = field.name;
      }
      return mappedField;
    });
  }
  mapDualFieldQMatrix(qMatrix, field) {
    function uniqueFilter(value, index, self) {
      return self.indexOf(value) === index;
    }
    return qMatrix
      .map(row => HyperCubeUtils.getDualDataRow(row[field.index]))
      .filter(uniqueFilter);
  }
  getMapTableForDualField(field) {
    const that = this;
    const concatQMatrix = that.hyperCubeLayout.qDataPages.reduce(
      (prev, curr) => [...prev, ...curr.qMatrix],
      [],
    );
    const data = that.mapDualFieldQMatrix(concatQMatrix, field);
    const headers = HyperCubeUtils.getDualHeadersForField(field);
    const inlineData = `${headers}\n${data.join('\n')}`;
    const name = `MapDual__${field.name}`;
    const options = { name, prefix: 'Mapping' };
    if (this.section && this.items.length === 0) {
      options.section = this.section;
    }
    return new Table(inlineData, options);
  }
  getDataFromHyperCubeLayout() {
    const that = this;
    const data = that.hyperCubeLayout.qDataPages
      .map(dataPage =>
        dataPage.qMatrix
          .map(row =>
            row
              .map((cell, index) => {
                const field = that.fields[index];
                if (!field.isDual && HyperCubeUtils.isCellDual(cell, field)) {
                  field.isDual = true;
                }
                return HyperCubeUtils.getCellValue(cell, field);
              })
              .join(','))
          .join('\n'))
      .join('\n');
    return data;
  }
  getFieldsFromHyperCubeLayout() {
    const that = this;
    const fields = [];
    for (let i = 0; i < that.hyperCubeLayout.qDimensionInfo.length; i += 1) {
      fields.push({
        type: 'dimension',
        dimensionType: HyperCubeUtils.getDimensionType(that.hyperCubeLayout.qDimensionInfo[i]),
        name: that.hyperCubeLayout.qDimensionInfo[i].qFallbackTitle,
        displayFormat: that.hyperCubeLayout.qDimensionInfo[i].qNumFormat.qFmt,
        index: i,
      });
    }
    for (let j = 0; j < that.hyperCubeLayout.qMeasureInfo.length; j += 1) {
      fields.push({
        type: 'measure',
        name: that.hyperCubeLayout.qMeasureInfo[j].qFallbackTitle,
        index: that.hyperCubeLayout.qDimensionInfo.length + j,
      });
    }
    return fields;
  }
  getItems() {
    return this.items;
  }
}

export default HyperCube;
