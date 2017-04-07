import * as JsonToCsv from '../../../src/utils/json-to-csv';
import * as Utils from '../../../src/utils/utils';

describe('JSON To CSV', () => {
  it('should be json data', () => {
    const jsonData = [{ Header1: 'a1', Header2: 'b1' }, { Header1: 'a2', Header2: 'b2' }, { Header1: 'a3', Header2: 'b3' }];
    expect(JsonToCsv.isJson(jsonData)).to.be.true;
  });

  it('should not be json data if the array contains non objects', () => {
    const jsonData = ['', undefined];
    expect(JsonToCsv.isJson(jsonData)).to.be.false;
  });


  it('should not be json data', () => {
    const jsonData = 'Header1, Header2\na1, b1\na2, b2\n';
    expect(JsonToCsv.isJson(jsonData)).to.be.false;
  });

  it('should convert json into csv', () => {
    const jsonData = [{ Header1: 'a1', Header2: 'b1' }, { Header1: 'a2', Header2: 'b2' }, { Header1: 'a3', Header2: 'b3' }];
    expect(JsonToCsv.convert(jsonData)).to.eql('Header1,Header2\na1,b1\na2,b2\na3,b3');
  });

  it('should convert json into csv', () => {
    const jsonData = { Header1: 'a1', Header2: 'b1' };
    expect(JsonToCsv.convert(jsonData)).to.eql('Header1,Header2\na1,b1');
  });
});
