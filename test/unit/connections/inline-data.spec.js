import InlineData from '../../../src/connections/inline-data';
import { newlineChar } from '../../../src/utils/utils';

describe('inline data', () => {
  it('should return empty lib statement', () => {
    const csvData = 'Header1,Header2\na1,b1\na2,b2\na3,b3';
    expect(new InlineData(csvData).getLibStatement()).to.be.undefined;
  });

  it('should return file extension html if no one is included in the path', () => {
    const csvData = 'Header1,Header2\na1,b1\na2,b2\na3,b3';
    expect(new InlineData(csvData).getScript()).to.eql('INLINE "\nHeader1,Header2\na1,b1\na2,b2\na3,b3\n"');
  });

  it('should return file extension txt', () => {
    const csvData = 'Header1,Header2\na1,b1\na2,b2\na3,b3';
    expect(new InlineData(csvData).getFileExtension()).to.eql('txt');
  });

  it('should escape " data', () => {
    const csvData = "Header'1,Header\"2\na]1,b1\na2,b\"2\na3,b3";
    expect(new InlineData(csvData).getScript()).to.eql("INLINE \"\nHeader'1,Header\"\"2\na]1,b1\na2,b\"\"2\na3,b3\n\"");
  });
});
