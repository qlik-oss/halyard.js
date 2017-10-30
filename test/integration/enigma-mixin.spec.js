import fs from 'fs';
import path from 'path';
import * as Utils from './utils';
import Halyard from '../../src/halyard';

const halyard = new Halyard();

const carmakersPath = path.join(__dirname, '../../examples/data/carmakers.json');
halyard.addTable(carmakersPath, 'Car Makers');

describe('Enigma Mixin', () => {
  it('should work to reload an existing app', () => {
    const docName = Utils.getUniqueDocName();
    return Utils.getQixService().then(qix => qix.global.createAppUsingHalyard(docName, halyard).then(appResult => appResult.session.close().then(() => qix.global.reloadAppUsingHalyard(docName, halyard).then(() => qix.global.openApp(docName).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
      expect(result[0].qValue[0].qText).to.eql('make_id');
    }))))));
  });

  it('should work to create a session app with halyard', () => Utils.getQixService().then(qix => qix.global.createSessionAppUsingHalyard(halyard).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
    expect(result[0].qValue[0].qText).to.eql('make_id');
  }))));

  it('should work to reload an non-existing app with the createIfMissing param', () => {
    const docName = Utils.getUniqueDocName();

    return Utils.getQixService().then(qix => qix.global.reloadAppUsingHalyard(docName, halyard, true).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
      expect(result[0].qValue[0].qText).to.eql('make_id');
      return app.doSave().then(saveresult => app.session.close().then(() => qix.global.reloadAppUsingHalyard(docName, halyard, true).then(app => app.getTableData(-1, 30, true, 'Car Makers').then((result) => {
        expect(result[0].qValue[0].qText).to.eql('make_id');
      }))));
    })));
  });
});
