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
      this.section = options;
      options = {};
    } else {
      this.name = options.name;
      if (!options.appendToPreviousSection) {
        if (options.section) {
          this.section = options.section;
        } else {
          this.section = options.name;
        }
      }
    }

    this.parseHyperCubeLayout(options);

    this.options = options;
  }

  validateHyperCubeLayout(hyperCubeLayout) {
    if (!hyperCubeLayout) {
      throw new Error('Hyper cube layout is undefined');
    }
    if (hyperCubeLayout.qMode === 'P') {
      throw new Error(
        'Cannot add hyper cube in pivot mode, qMode:P(DATA_MODE_PIVOT) is not supported'
      );
    }
    if (hyperCubeLayout.qMode === 'K') {
      throw new Error(
        'Cannot add hyper cube in stacked mode, qMode:K(DATA_MODE_PIVOT_STACK) is not supported'
      );
    }
    if (
      !hyperCubeLayout.qDataPages ||
      !hyperCubeLayout.qDataPages[0] ||
      !hyperCubeLayout.qDataPages[0].qMatrix ||
      !hyperCubeLayout.qDataPages[0].qMatrix.length ||
      hyperCubeLayout.qDataPages[0].qMatrix.length === 0
    ) {
      throw new Error('qDataPages is empty or undefined');
    }
    if (!hyperCubeLayout.qDimensionInfo) {
      throw new Error('qDimensionInfo is undefined');
    }
    if (!hyperCubeLayout.qMeasureInfo) {
      throw new Error('qMeasureInfo is undefined');
    }

    return hyperCubeLayout;
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
    if (hasDual) {
      options.appendToPreviousSection = true;
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
        mappedField.expr = `Dual(ApplyMap('MapDual__${field.name}', ${field.name}), ${field.name})`;
      } else {
        mappedField.src = field.name;
      }
      return mappedField;
    });
  }

  getMapTableForDualField(field) {
    const that = this;
    function uniqueFilter(value, index, self) {
      return self.indexOf(value) === index;
    }
    const data = that.hyperCubeLayout.qDataPages[0].qMatrix
      .map(row => HyperCubeUtils.getDualDataRow(row[field.index]))
      .filter(uniqueFilter);
    const headers = HyperCubeUtils.getDualHeadersForField(field);
    const inlineData = `${headers}\n${data.join('\n')}`;
    const name = `MapDual__${field.name}`;
    const options = { name, prefix: 'Mapping' };
    if (this.section && this.items.length === 0) {
      options.section = this.section;
    } else {
      options.appendToPreviousSection = true;
    }
    return new Table(inlineData, options);
  }
  getDataFromHyperCubeLayout() {
    const that = this;
    const data = that.hyperCubeLayout.qDataPages[0].qMatrix
      .map(row =>
        row
          .map((cell, index) => {
            const field = that.fields[index];
            if (
              !field.isDual &&
              HyperCubeUtils.isCellDual(cell, field)
            ) {
              field.isDual = true;
            }
            return HyperCubeUtils.getCellValue(cell, field);
          })
          .join(',')
      )
      .join('\n');
    return data;
  }
  getFieldsFromHyperCubeLayout() {
    const that = this;
    const fields = [];
    for (let i = 0; i < that.hyperCubeLayout.qDimensionInfo.length; i += 1) {
      fields.push({
        type: 'dimension',
        dimensionType: HyperCubeUtils.getDimensionType(
          that.hyperCubeLayout.qDimensionInfo[i]
        ),
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
