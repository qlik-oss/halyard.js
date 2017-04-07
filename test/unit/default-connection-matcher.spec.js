import FileConnection from '../../src/connections/file';
import WebConnection from '../../src/connections/web-file';
import InlineData from '../../src/connections/inline-data';

import DefaultConnectionMatcher from '../../src/default-connection-matcher';

describe('Bootstrap connection matcher', () => {
  it('should return an file connector instance', () => {
    expect(DefaultConnectionMatcher.findMatch('C:\\data\\data.txt') instanceof FileConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('C:\\data.txt') instanceof FileConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('\\data.txt') instanceof FileConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('/data/data.txt') instanceof FileConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('/data.txt') instanceof FileConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('/data.txt') instanceof FileConnection).to.be.true;
  });

  it('should return an webfile connector instance', () => {
    expect(DefaultConnectionMatcher.findMatch('https://www.allsvenskan.se/tabell/') instanceof WebConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('https://www.allsvenskan.se/tabell') instanceof WebConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('https://www.allsvenskan.se/tabell/data.txt') instanceof WebConnection).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('http://www.allsvenskan.se/tabell/data.txt') instanceof WebConnection).to.be.true;
  });

  it("should data that doesn't match other matcher should be treated as inline data", () => {
    expect(DefaultConnectionMatcher.findMatch('a,b,c\n1,2,3\n4,5,6\n') instanceof InlineData).to.be.true;
    expect(DefaultConnectionMatcher.findMatch('https://www.allsvenskan.se/tabell/1,2,3\n1,2,3\n4,5,6\n') instanceof InlineData).to.be.true;
    expect(DefaultConnectionMatcher.findMatch([{ a: 1, b: 2, c: 3 }, { a: 4, b: 5, c: 6 }]) instanceof InlineData).to.be.true;
  });
});
