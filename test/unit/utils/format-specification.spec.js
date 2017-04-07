import formatSpecification from '../../../src/utils/format-specification';
import { newlineChar } from '../../../src/utils/utils';


describe('Format Specifiaction', () => {
  it('should return empty string if no options are sent', () => {
    expect(formatSpecification()).to.eql('');
  });

  it('should return the file extension as the file specification', () => {
    expect(formatSpecification({ fileExtension: 'txt' })).to.eql('\n(txt)');
    expect(formatSpecification({ fileExtension: 'csv' })).to.eql('\n(txt)');
    expect(formatSpecification({ fileExtension: 'html' })).to.eql('\n(html)');
    expect(formatSpecification({ fileExtension: 'htm' })).to.eql('\n(html)');
    expect(formatSpecification({ fileExtension: 'xlsx' })).to.eql('\n(ooxml)');
  });

  it('should embeded labels if header row nr is included', () => {
    expect(formatSpecification({ headerRowNr: 1 })).to.eql('\n(header is 1 lines, embedded labels)');
  });

  it('should embeded labels if header row nr is included and file extension', () => {
    expect(formatSpecification({ fileExtension: 'txt', headerRowNr: 1 })).to.eql('\n(txt, header is 1 lines, embedded labels)');
    expect(formatSpecification({ fileExtension: 'csv', headerRowNr: 1 })).to.eql('\n(txt, header is 1 lines, embedded labels)');
    expect(formatSpecification({ fileExtension: 'xlsx', headerRowNr: 1 })).to.eql('\n(ooxml, header is 1 lines, embedded labels)');
  });

  describe('supporterd character sets', () => {
    it('should support', () => {
      expect(formatSpecification({ characterSet: 'utf8' })).to.eql('\n(utf8)');
      expect(formatSpecification({ characterSet: 'unicode' })).to.eql('\n(unicode)');
      expect(formatSpecification({ characterSet: 'ansi' })).to.eql('\n(ansi)');
      expect(formatSpecification({ characterSet: 'oem' })).to.eql('\n(oem)');
      expect(formatSpecification({ characterSet: 'mac' })).to.eql('\n(mac)');
    });

    it('should support character codes', () => {
      expect(formatSpecification({ characterSet: '1024' })).to.eql('\n(codepage is 1024)');
      expect(formatSpecification({ characterSet: 1024 })).to.eql('\n(codepage is 1024)');
    });

    it('should not include unsupport format', () => {
      expect(formatSpecification({ characterSet: 'custom' })).to.eql('');
    });

    it('should support no labels', () => {
      expect(formatSpecification({ noLabels: 'true' })).to.eql('\n(no labels)');
    });
  });
});


// embedded labels
