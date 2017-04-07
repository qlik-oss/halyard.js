import path from 'path';
import * as Utils from './utils';
import Halyard from '../../dist/halyard';

const carmakersPath = path.join(__dirname, '../../examples/data/carmakers.json');

describe('Connections', () => {
  const url = 'http://localhost:9000/attendance.html';

  it('should work to load data from webfiles', () => Utils.httpServer().then(() => {
    const halyard = new Halyard();

    const table = new Halyard.Table(url, { name: 'Allsvenskan', headerRowNr: 1, characterSet: 'utf8' });

    halyard.addTable(table);

    return Utils.getQixService().then((qix) => {
      const docName = Utils.getUniqueDocName();

      return qix.global.createAppUsingHalyard(docName, halyard).then(result => qix.global.openDoc(docName).then(app => app.getTableData(-1, 30, true, 'Allsvenskan').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('Lag');
        expect(result[1].qValue[0].qText).to.eql('Hammarby');

        expect(result[0].qValue[1].qText).to.eql('Hemmasnitt');
        expect(result[1].qValue[1].qText).to.eql('11 885');
      })));
    });
  }));


  it('should work to inline load a json file', () => Utils.openFile(carmakersPath).then((data) => {
    const halyard = new Halyard();

    halyard.addTable(JSON.parse(data), 'Car Makers');

    return Utils.getQixService().then((qix) => {
      const docName = Utils.getUniqueDocName();

      return qix.global.createAppUsingHalyard(docName, halyard).then(result => qix.global.openDoc(docName).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('make_id');
      })));
    });
  }));

  it('should work load data from local file', () => {
    const halyard = new Halyard();

    const table = new Halyard.Table(carmakersPath, 'Car Makers');

    halyard.addTable(table);

    return Utils.getQixService().then((qix) => {
      const docName = Utils.getUniqueDocName();

      return qix.global.createAppUsingHalyard(docName, halyard).then(result => qix.global.openDoc(docName).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('make_id');
      })));
    });
  });
});
