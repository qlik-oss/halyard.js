import path from 'path';
import getIp from 'dev-ip';
import Halyard from '../../src/halyard.js';
import * as Utils from './utils';

describe('Enigma Mixin error handling', () => {
  let docName = '';
  const ip = getIp()[0];
  const url = `http://${ip}:9000/attendance.html`;

  beforeEach(() => {
    docName = Utils.getUniqueDocName();
  });

  it('should throw connection error if resource is misspelled', () => {
    const halyard = new Halyard();

    const url = 'http://www.misspelleddatasource.se/thatdoesntexists/';

    halyard.addTable(url, { name: 'Table' });

    return Utils.openSession(docName).then(session => session.createAppUsingHalyard(docName, halyard).then((result) => {})
      .catch((err) => {
        expect(err.type).to.eql('Connection Error');
      }).then( () => session.session.close()));
  });

  it("should throw loading error if field src doesn't exist", () => {
    const halyard = new Halyard();

    halyard.addTable(url, { name: 'Allsvenskan', fields: [{ src: 'apa', name: 'Test' }] });

    return Utils.openSession(docName).then(session => session.createAppUsingHalyard(docName, halyard).then((result) => {})
      .catch((err) => {
        expect(err.type).to.eql('Loading Error');
      }).then( () => session.session.close()));
  });

  it('should throw syntax error if expression is invalid', () => {
    const halyard = new Halyard();

    halyard.addTable(url, { name: 'Allsvenskan', fields: [{ expr: 'adsfasdfdsf(aoa)', name: 'Test' }] });

    return Utils.openSession(docName).then(session => session.createAppUsingHalyard(docName, halyard).then((result) => {})
      .catch((err) => {
        expect(err.type).to.eql('Syntax Error');
      }).then( () => session.session.close()));
  });
});
