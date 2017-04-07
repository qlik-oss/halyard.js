import * as Utils from '../../../src/utils/utils';

describe('utils', () => {
  it('should return file extension if included in path', () => {
    expect(Utils.fileExtension('C:\\data\\file.txt')).to.eql('txt');
    expect(Utils.fileExtension('/Users/seb/file.txt')).to.eql('txt');
    expect(Utils.fileExtension('C:\\data\\file')).to.be.null;
    expect(Utils.fileExtension('C:datafile')).to.be.null;
  });


  it('should return file name if included in path', () => {
    expect(Utils.fileName('C:\\data\\file.txt')).to.eql('file.txt');
    expect(Utils.fileName('/Users/seb/file.txt')).to.eql('file.txt');
    expect(Utils.fileName('C:\\data\\file')).to.eql('file');
    expect(Utils.fileName('C:datafile')).to.be.null;
  });

  it('should return folder name if included in path', () => {
    expect(Utils.folderPath('C:\\data\\file.txt')).to.eql('C:\\data');
    expect(Utils.folderPath('C:\\data\\file')).to.eql('C:\\data');
    expect(Utils.folderPath('/Users/seb/file.txt')).to.eql('/Users/seb');
    expect(Utils.folderPath('C:datafile')).to.be.null;
  });

  it('should return indentation as two spaces', () => {
    expect(Utils.indentation()).to.eql('  ');
  });

  it('should return field name', () => {
    expect(Utils.getFieldName({ name: 'name' })).to.eql('name');
    expect(Utils.getFieldName({ src: 'src' })).to.eql('src');
    expect(Utils.getFieldName({ expr: 'expr' })).to.be.undefined;
  });
});
