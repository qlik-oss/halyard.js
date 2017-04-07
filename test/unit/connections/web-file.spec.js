import WebFileConnector from '../../../src/connections/web-file';

describe('web file connector', () => {
  it('should return file extension html if no one is included in the path', () => {
    const webfileconnector = new WebFileConnector('http://www.google.com/data');
    expect(webfileconnector.getFileExtension()).to.eql('html');
  });

  it('should return file extension html if no one is included in the path', () => {
    const webfileconnector = new WebFileConnector('http://www.x-rates.com/historical/?from=USD&amount=1.00&date=2017-03-19');
    expect(webfileconnector.getFileExtension()).to.eql('html');
  });

  it('should be possible to set file extension', () => {
    const webfileconnector = new WebFileConnector('http://www.google.com/data', 'csv');
    expect(webfileconnector.getFileExtension()).to.eql('csv');
  });

  it('should return file extension if included in the path', () => {
    const webfileconnector = new WebFileConnector('http://www.google.com/data.txt');
    expect(webfileconnector.getFileExtension()).to.eql('txt');
  });

  it('should return file extension if included in the path', () => {
    const webfileconnector = new WebFileConnector('https://thingspeak.com/channels/132624/feed.csv?results=6000');
    expect(webfileconnector.getFileExtension()).to.eql('csv');
  });

  it('should be possible to set file extension', () => {
    const webfileconnector = new WebFileConnector('https://thingspeak.com/channels/132624', 'csv');
    expect(webfileconnector.getFileExtension()).to.eql('csv');
  });

  it('should be possible to set file extension', () => {
    const webfileconnector = new WebFileConnector('https://thingspeak.com/channels/132624.aspx', 'csv');
    expect(webfileconnector.getFileExtension()).to.eql('csv');
  });

  it('should have connection type of internet', () => {
    const webfileconnector = new WebFileConnector('http://www.google.com/data.txt');
    expect(webfileconnector.getConnectionType()).to.eql('internet');
  });

  it('should return script with connection name', () => {
    const fileconnector = new WebFileConnector('http://www.google.com/data.txt');
    expect(fileconnector.getScript()).to.eql(`FROM [lib://${fileconnector.getName()}]`);
  });
});
