import { newlineChar, indentation } from '../../src/utils/utils';
import HyperCube from '../../src/hyper-cube';
import mockHyperCubes from './mocks/hyper-cubes';

describe('HyperCube', () => {
  it('should not be possible to add a hyper cube without a layout', () => {
    expect(
      () => new HyperCube()
    ).to.throw(
      'Hyper cube layout is undefined'
    );
  });

  it('should be possible to add a valid hyper cube layout', () => {
    const hyperCube = new HyperCube(mockHyperCubes.StraightMode, 'ValidHyperCube')
    expect(hyperCube).to.be.an('object');
  });

  it('should not be possible to add a hyper cube layout in pivot mode', () => {
    expect(
      () => new HyperCube(mockHyperCubes.PivotMode, 'PivotHyperCube')
    ).to.throw(
      'Cannot add hyper cube in pivot mode, qMode:P(DATA_MODE_PIVOT) is not supported'
    );
  });


  it('should not be possible to add a hyper cube layout in stacked mode', () => {
    expect(
      () => new HyperCube(mockHyperCubes.StackedMode, 'StackedHyperCube')
    ).to.throw(
      'Cannot add hyper cube in stacked mode, qMode:K(DATA_MODE_PIVOT_STACK) is not supported'
    );
  });

  it('should not be possible to add a hyper cube layout without data', () => {
    expect(
      () => new HyperCube(
        {
          qMode: 'S',
          qDimensionInfo: {},
          qMeasureInfo: {}
        }, 'StackedHyperCube')
    ).to.throw(
      'qDataPages are undefined'
    );
  });

  it('should not be possible to add a hyper cube layout without data', () => {
    expect(
      () => new HyperCube(mockHyperCubes.NoData, 'NoDataHyperCube')
    ).to.throw('qDataPages are empty');
  });

  it('should not be possible to add a hyper cube layout with missing data pages', () => {
    expect(
      () => new HyperCube(mockHyperCubes.MultipleDataPagesMissingPages, 'PivotHyperCube')
    ).to.throw(
      'qDataPages are missing pages.'
    );
  });

  it('should not be possible to add a hyper cube layout without qDataPages[].qMatrix', () => {
    expect(
      () => new HyperCube(
        {
          qMode: 'S',
          qDimensionInfo: {},
          qMeasureInfo: {},
          qDataPages: [{qArea: {}}]
        }, 'StackedHyperCube')
    ).to.throw(
      'qMatrix of qDataPages are undefined'
    );
  });

  it('should not be possible to add a hyper cube layout without qDataPages[].qArea', () => {
    expect(
      () => new HyperCube(
        {
          qMode: 'S',
          qDimensionInfo: {},
          qMeasureInfo: {},
          qDataPages: [{qMatrix: [{}]}]
        }, 'StackedHyperCube')
    ).to.throw(
      'qArea of qDataPages are undefined'
    );
  });

  it('should not be possible to add a hyper cube layout with first data page starting at qTop greater than zero', () => {
    expect(
      () => new HyperCube(mockHyperCubes.MultipleDataPagesDoesntStartAtTopZero, 'PivotHyperCube')
    ).to.throw(
      'qDataPages first page should start at qTop: 0.'
    );
  });

  it('should not be possible to add a hyper cube layout with overlapping data pages', () => {
    expect(
      () => new HyperCube(mockHyperCubes.MultipleDataPagesOverlapingPages, 'PivotHyperCube')
    ).to.throw(
      'qDataPages have overlapping data pages.'
    );
  });

  it('should not be possible to add a hyper cube layout with data pages not of full qWidth', () => {
    expect(
      () => new HyperCube(mockHyperCubes.MultipleDataPagesNotFullWidth, 'PivotHyperCube')
    ).to.throw(
      'qDataPages have data pages that\'s not of full qWidth.'
    );
  });

  it('should not be possible to add a hyper cube layout without qDimensionInfo', () => {
    expect(
      () =>
        new HyperCube(mockHyperCubes.NoDimensionInfo, 'NoDimensionInfoHyperCube')
    ).to.throw('qDimensionInfo is undefined');
  });

  it('should not be possible to add a hyper cube layout without qMeasureInfo', () => {
    expect(
      () =>
        new HyperCube(mockHyperCubes.NoMeasureInfo, 'NoMeasureInfoHyperCube')
    ).to.throw('qMeasureInfo is undefined');
  });

  it('should hypercube layout is not valid ', () => {
    expect(
      () => new HyperCube(
        {
          qDimensionInfo: {},
          qMeasureInfo: {},
        })
    ).to.throw(
      'HyperCubeLayout is not valid'
    );
  });

  it('should return items', () => {
    const hyperCube = new HyperCube(mockHyperCubes.StraightMode, 'ValidHyperCube');
    expect(hyperCube.getItems()).to.be.an('array').to.have.lengthOf(2);
  });

  it('should return hyper cube name', () => {
    const hyperCube = new HyperCube(mockHyperCubes.StraightMode, 'ValidHyperCube');
    expect(hyperCube.getItems()[1].getName()).to.eql('ValidHyperCube');
  });

  describe('options', () => {
    it('should return name from options', () => {
      const hyperCube2 = new HyperCube(mockHyperCubes.StraightMode, {name:'ValidHyperCube'});
      expect(hyperCube2.getItems()[1].getName()).to.eql('ValidHyperCube');
    });

    it('should return section from options', () => {
      const hyperCube2 = new HyperCube(mockHyperCubes.StraightMode, {name:'ValidHyperCube', section: 'Data (HyperCube)'});
      expect(hyperCube2.getItems()[0].getSection()).to.eql('Data (HyperCube)');
    });
  });
});
