import FileConnector from '../../../src/connections/file';

describe('file connector', () => {
  describe('file extension', () => {
    it('should default to txt if file extension is not in the path', () => {
      const fileconnector = new FileConnector('C:\\data\\file');
      expect(fileconnector.getFileExtension()).to.eql('txt');
    });

    it('should return txt if included in path', () => {
      const fileconnector = new FileConnector('C:\\data\\file.txt');
      expect(fileconnector.getFileExtension()).to.eql('txt');
    });
  });

  describe('qix connection object', () => {
    let fileconnector;
    let qixConnectionObject;

    beforeEach(() => {
      fileconnector = new FileConnector('C:\\data\\file.txt');
      qixConnectionObject = fileconnector.getQixConnectionObject();
    });

    it('should including connection string', () => {
      expect(qixConnectionObject.qConnectionString).to.eql('C:\\data');
    });

    it('should including folder as type', () => {
      expect(qixConnectionObject.qType).to.eql('folder');
    });
  });

  it('should return script with connection name and file', () => {
    const fileconnector = new FileConnector('C:\\data\\file.txt');
    expect(fileconnector.getScript()).to.eql(`FROM [lib://${fileconnector.getName()}/file.txt]`);
  });
});
