import * as Utils from '../../../src/utils/hyper-cube-utils';

describe('hyper cube utils', () => {
  describe('escapeStringContainingDelimiter', ()=>{
    it('should return timestamp', () => {
      expect(Utils.getDimensionType({qDimensionType: 'T'})).to.eql('timestamp');
    });
  });

  describe('getTextCellValue', ()=>{
    it("should escape and remove newline", () => {
      expect(Utils.getCellValue({qText: "\'1\',\n\'2\'"} , {type: 'dimension'})).to.eql("\'\'\'1\'\', \'\'2\'\'\'");
    });
  });
});
