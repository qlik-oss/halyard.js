import { newlineChar, indentation } from '../../src/utils/utils';
import HyperCube from '../../src/hyper-cube';
import mockHyperCubes from './mocks/hyper-cubes';

describe('HyperCube', () => {
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
      () => new HyperCube(mockHyperCubes.NoData, 'NoDataHyperCube')
    ).to.throw('qDataPages are empty');
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
  it('should return items', () => {
    const hyperCube = new HyperCube(mockHyperCubes.StraightMode, 'ValidHyperCube')
    expect(hyperCube.getItems()).to.be.an('array').to.have.lengthOf(2);
  });
  
  it('should return hyper cube name', () => {
    const hyperCube = new HyperCube(mockHyperCubes.StraightMode, 'ValidHyperCube')
    expect(hyperCube.getItems()[1].getName()).to.eql('ValidHyperCube');
  });

  describe('options', () => {
    it('should return name from options', () => {
      const hyperCube2 = new HyperCube(mockHyperCubes.StraightMode, {name:'ValidHyperCube'})
      expect(hyperCube2.getItems()[1].getName()).to.eql('ValidHyperCube');
    });

    it('should return section from options', () => {
      const hyperCube2 = new HyperCube(mockHyperCubes.StraightMode, {name:'ValidHyperCube', section: 'Data (HyperCube)'})
      expect(hyperCube2.getItems()[0].getSection()).to.eql('Data (HyperCube)');
    });    
  });
});
