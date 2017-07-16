import Table from './table';
import { validFieldType } from './utils/utils';
import * as HyperCubeUtils from './utils/hyper-cube-utils';

class HyperCube {
  constructor(hyperCubeLayout, options) {
    this.items = [];
    this.fields = [];
    this.hyperCubeLayout = this.validateHyperCubeLayout(hyperCubeLayout);

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

    this.parseHyperCubeLayout(hyperCubeLayout, options);

    this.options = options;
  }

  validateHyperCubeLayout(hyperCubeLayout) {
    if (!hyperCubeLayout) {
      throw new Error(
        'Hyper cube layout is undefined'
      );
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

  parseHyperCubeLayout(hyperCubeLayout) {
    this.fields = this.getFieldsFromHyperCubeLayout(hyperCubeLayout);
    this.data = this.getDataFromHyperCubeLayout(hyperCubeLayout);
    const inlineData = `${this.fields
      .map(field => field.name)
      .join(',')}\n${this.data}`;
    let hasDual = false;
    this.fields.forEach((field) => {
      if (field.isDual) {
        hasDual = true;
        this.items.push(this.getMapTableForDualField(field, hyperCubeLayout));
      }
    });
    const options = { name: this.name, fields: this.getFieldsDefinition(this.fields) };
    if (hasDual) {
      options.appendToPreviousSection = true;
    }
    this.items.push(new Table(inlineData, options));
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

  getMapTableForDualField(field, hyperCubeLayout) {
    function uniqueFilter(value, index, self) {
      return self.indexOf(value) === index;
    }
    const data = hyperCubeLayout.qDataPages[0].qMatrix
      .map(row => `${row[field.index].qNum},${row[field.index].qText}`)
      .filter(uniqueFilter);
    const inlineData = `${field.name},${field.name}_qText\n${data.join('\n')}`;
    const name = `MapDual__${field.name}`;
    const options = { name, prefix: 'Mapping' };
    if (this.section && this.items.length === 0) {
      options.section = this.section;
    } else {
      options.appendToPreviousSection = true;
    }
    return new Table(inlineData, options);
  }
  getDataFromHyperCubeLayout(hyperCubeLayout) {
    const that = this;
    const data = hyperCubeLayout.qDataPages[0].qMatrix
      .map(row =>
        row
          .map((cell, index) => {
            let value = cell.qText;
            if (HyperCubeUtils.storeNumeric(that.fields[index])) {
              value = cell.qNum;
              if (HyperCubeUtils.checkIfFieldIsDual(that.fields[index])) {
                if (HyperCubeUtils.isCellDual(cell)) {
                  that.fields[index].isDual = true;
                }
              }
            }
            return value;
          })
          .join(',')
      )
      .join('\n');
    return data;
  }
  getFieldsFromHyperCubeLayout(hyperCubeLayout) {
    const fields = [];
    for (let i = 0; i < hyperCubeLayout.qDimensionInfo.length; i += 1) {
      fields.push({
        type: 'dimension',
        dimensionType: HyperCubeUtils.getDimensionType(
          hyperCubeLayout.qDimensionInfo[i]
        ),
        name: hyperCubeLayout.qDimensionInfo[i].qFallbackTitle,
        displayFormat: hyperCubeLayout.qDimensionInfo[i].qNumFormat.qFmt,
        index: i,
      });
    }
    for (let j = 0; j < hyperCubeLayout.qMeasureInfo.length; j += 1) {
      fields.push({
        type: 'measure',
        name: hyperCubeLayout.qMeasureInfo[j].qFallbackTitle,
        index: hyperCubeLayout.qDimensionInfo.length + j,
      });
    }
    return fields;
  }
  getItems() {
    return this.items;
  }
}

export default HyperCube;
