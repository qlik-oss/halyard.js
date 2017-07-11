import Table from './table';

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
    if (hyperCubeLayout.qMode === 'P') {
      throw new Error('qMode:P(DATA_MODE_PIVOT) is not supported');
    }
    if (hyperCubeLayout.qMode === 'K') {
      throw new Error('qMode:K(DATA_MODE_PIVOT_STACK) is not supported');
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
    const fields = this.fields.map((field) => {
      const mappedField = { name: field.name };
      if (
        field.dimensionType === 'timestamp' ||
        field.dimensionType === 'time' ||
        field.dimensionType === 'date'
      ) {
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
    const options = { name: this.name, fields };
    if (hasDual) {
      options.appendToPreviousSection = true;
    }
    this.items.push(new Table(inlineData, options));
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
    const data = hyperCubeLayout.qDataPages[0].qMatrix
      .map(row =>
        row
          .map((cell, index) => {
            let value = cell.qNum;
            if (
              this.fields[index].type === 'dimension' &&
              this.fields[index].dimensionType !== 'timestamp' &&
              this.fields[index].dimensionType !== 'time' &&
              this.fields[index].dimensionType !== 'date'
            ) {
              if (this.fields[index].dimensionType !== 'num') {
                value = cell.qText;
              } else if (
                !this.fields[index].isDual &&
                cell.qText !== Number(cell.qNum).toString()
              ) {
                this.fields[index].isDual = true;
              }
            }
            return value;
          })
          .join(',')
      )
      .join('\n');
    return data;
  }
  getDimensionType(dimension) {
    let dimensionType = 'text';
    if (dimension.qDimensionType === 'N') {
      if (dimension.qTags.indexOf('$numeric') > -1) {
        if (dimension.qTags.indexOf('$date') > -1 && dimension.qTags.indexOf('$integer') > -1) {
          dimensionType = 'date';
        } else if (dimension.qTags.indexOf('$time') > -1) {
          dimensionType = 'time';
        } else if (dimension.qTags.indexOf('$timestamp') > -1) {
          dimensionType = 'timestamp';
        } else {
          dimensionType = 'num';
        }
      } else {
        dimensionType = 'mixed';
      }
    } else if (dimension.qDimensionType === 'T') {
      dimensionType = 'timestamp';
    }
    return dimensionType;
  }
  getFieldsFromHyperCubeLayout(hyperCubeLayout) {
    const fields = [];
    for (let i = 0; i < hyperCubeLayout.qDimensionInfo.length; i += 1) {
      fields.push({
        type: 'dimension',
        dimensionType: this.getDimensionType(hyperCubeLayout.qDimensionInfo[i]),
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
}

export default HyperCube;
