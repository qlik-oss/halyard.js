import Table from './table';

class HyperCube {
  constructor(hyperCubeLayout, options) {
    this.items = [];
    this.fields = [];
    this.hyperCubeLayout = hyperCubeLayout;

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

  parseHyperCubeLayout(hyperCubeLayout) {
    this.fields = this.getFieldsFromHyperCubeLayout(hyperCubeLayout);
    this.data = this.getDataFromHyperCubeLayout(hyperCubeLayout);
    const inlineData = `${this.fields.map(field => field.name).join(',')}\n${this.data}`;
    let hasDual = false;
    this.fields.forEach((field) => {
      if (field.isDual) {
        hasDual = true;
        this.items.push(this.getMapTableForDualField(field, hyperCubeLayout));
      }
    });
    const fields = this.fields.map((field) => {
      const mappedField = { name: field.name };
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
    const data = hyperCubeLayout.qDataPages[0].qMatrix.map(row => `${row[field.index].qNum},${row[field.index].qText}`
    );
    const inlineData = `${field.name},${field.name}_qText\n${data.join('\n')}`;
    const name = `MapDual__${field.name}`;
    return new Table(inlineData, { name, prefix: 'Mapping' });
  }
  getDataFromHyperCubeLayout(hyperCubeLayout) {
    const data = hyperCubeLayout.qDataPages[0].qMatrix.map(row =>
       row.map((cell, index) => {
         let value = cell.qNum;
         if (this.fields[index].type === 'dimension') {
           if (this.fields[index].dimensionType !== 'numeric') {
             value = cell.qText;
           } else if (!this.fields[index].isDual && cell.qText !== Number(cell.qNum).toString()) {
             this.fields[index].isDual = true;
           }
         }
         return value;
       }).join(',')
    ).join('\n');
    return data;
  }
  getDimensionType(dimension) {
    let dimensionType = 'string';
    if (dimension.qDimensionType === 'N') {
      if (dimension.qTags.indexOf('$numeric') > -1) {
        dimensionType = 'numeric';
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
      fields.push({ type: 'dimension',
        dimensionType: this.getDimensionType(hyperCubeLayout.qDimensionInfo[i]),
        name: hyperCubeLayout.qDimensionInfo[i].qFallbackTitle,
        index: i });
    }
    for (let j = 0; j < hyperCubeLayout.qMeasureInfo.length; j += 1) {
      fields.push({ type: 'measure',
        name: hyperCubeLayout.qMeasureInfo[j].qFallbackTitle,
        index: hyperCubeLayout.qDimensionInfo.length + j });
    }
    return fields;
  }
}

export default HyperCube;
