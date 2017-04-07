import path from 'path';
import Halyard from '../../dist/halyard.js';
import * as Utils from './utils';

after(() => {
  console.log('Cleaning up artifacts...');
  return Utils.removeAllTestDoc().catch((err) => { console.log(err); });
});

describe('Enigma Mixin error handling', () => {
  const carmakersPath = path.join(__dirname, '../../examples/data/carmakers.json');

  let docName = '';

  beforeEach(() => {
    docName = Utils.getUniqueDocName();
  });

  it('should throw connection error if resource is misspelled', () => {
    const halyard = new Halyard();

    const url = 'http://www.misspelleddatasource.se/thatdoesntexists/';

    halyard.addTable(url, { name: 'Table' });

    return Utils.getQixService().then(qix => qix.global.createAppUsingHalyard(docName, halyard).then((result) => {})
      .catch((err) => {
        expect(err.type).to.eql('Connection Error');
      }));
  });

  it("should throw loading error if field src doesn't exist", () => {
    const halyard = new Halyard();

    const url = 'https://www.allsvenskan.se/tabell/';

    halyard.addTable(url, { name: 'Allsvenskan', fields: [{ src: 'apa', name: 'Test' }] });

    return Utils.getQixService().then(qix => qix.global.createAppUsingHalyard(docName, halyard).then((result) => {})
      .catch((err) => {
        expect(err.type).to.eql('Loading Error');
      }));
  });

  it('should throw syntax error if expression is invalid', () => {
    const halyard = new Halyard();

    const url = 'https://www.allsvenskan.se/tabell/';
    halyard.addTable(url, { name: 'Allsvenskan', fields: [{ expr: 'adsfasdfdsf(aoa)', name: 'Test' }] });

    return Utils.getQixService().then(qix => qix.global.createAppUsingHalyard(docName, halyard).then((result) => {})
      .catch((err) => {
        expect(err.type).to.eql('Syntax Error');
      }));
  });
});
