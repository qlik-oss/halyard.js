import path from 'path';
import * as Utils from './utils';
import Halyard from '../../src/halyard';
import getIp from 'dev-ip';

const carmakersPath = path.join(process.cwd(), './examples/data/carmakers.json');

describe('Connections', () => {
  const ip = getIp()[0];

  it('should work to load data from http', () => {
    const url = `http://${ip}:9000/attendance.html`;
    const halyard = new Halyard();

    const table = new Halyard.Table(url, { name: 'Allsvenskan', headerRowNr: 1, characterSet: 'utf8' });

    halyard.addTable(table);
    const docName = Utils.getUniqueDocName();

    return Utils.openSession(docName).then((session) => {

      return session.createAppUsingHalyard(docName, halyard).then(result => session.openDoc(docName).then(app => app.getTableData(-1, 30, true, 'Allsvenskan').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('Lag');
        expect(result[1].qValue[0].qText).to.eql('Hammarby');

        expect(result[0].qValue[1].qText).to.eql('Hemmasnitt');
        expect(result[1].qValue[1].qText).to.eql('11 885');
      })
      .then( () => session.session.close())));
    });
  });

  it.skip('should work to load data from https', () => {
    const url = `https://${ip}:9001/attendance.html`;
    const halyard = new Halyard();

    const table = new Halyard.Table(url, { name: 'Allsvenskan', headerRowNr: 1, characterSet: 'utf8' });

    halyard.addTable(table);

    const docName = Utils.getUniqueDocName();
    return Utils.openSession(docName).then((session) => {

      return session.createAppUsingHalyard(docName, halyard).then(result => session.openDoc(docName).then(app => app.getTableData(-1, 30, true, 'Allsvenskan').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('Lag');
        expect(result[1].qValue[0].qText).to.eql('Hammarby');

        expect(result[0].qValue[1].qText).to.eql('Hemmasnitt');
        expect(result[1].qValue[1].qText).to.eql('11 885');
      })))
      .catch((err) => {
        throw err;
      });
    });
  });


  it('should work to inline load a json file', () => Utils.openFile(carmakersPath).then((data) => {
    const halyard = new Halyard();

    halyard.addTable(JSON.parse(data), 'Car Makers');

    const docName = Utils.getUniqueDocName();
    return Utils.openSession(docName).then((session) => {

      return session.createAppUsingHalyard(docName, halyard).then(result => session.openDoc(docName).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('make_id');
      })
      .then( () => session.session.close())));
    });
  }));

  it('should work load data from local file', () => {
    const halyard = new Halyard();

    const table = new Halyard.Table(carmakersPath, 'Car Makers');

    halyard.addTable(table);

    const docName = Utils.getUniqueDocName();
    return Utils.openSession(docName).then((session) => {

      return session.createAppUsingHalyard(docName, halyard).then(result => session.openDoc(docName).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('make_id');
      })
      .then( () => session.session.close())));
    })
  });
});
