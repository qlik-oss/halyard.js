import fs from 'fs';
import Promise from 'bluebird';
import enigma from 'enigma.js';
import { create } from 'browser-sync';

import enigmaConfig from './enigma-config';
import enigmaMixin from '../../src/enigma-mixin/halyard-enigma-mixin';

enigmaConfig.mixins = enigmaMixin;

const docNamePrefix = 'HalyardIntegrationTest';


export function getUniqueDocName() {
  return `${docNamePrefix}-${Math.floor(Math.random() * 100000)}`;
}

export function getQixService() {
  return enigma.getService('qix', enigmaConfig);
}

export function removeAllTestDoc() {
  return getQixService().then(qix => qix.global.getDocList().then((list) => {
    const docsToDelete = [];

    const integrationTestDocs = list.filter(doc => doc.qDocName.match(docNamePrefix));

    integrationTestDocs.forEach((doc) => {
      docsToDelete.push(qix.global.deleteApp(doc.qDocId));
    });

    return Promise.all(docsToDelete);
  }));
}

export function openFile(filePath) {
  return new Promise((resolve) => {
    resolve(fs.readFileSync(filePath, 'utf8').toString());
  });
}

export function httpServer() {
  const httpConfig = {
    logLevel: 'silent',
    notify: false,
    ghostMode: false,
    port: 9000,
    open: false,
    directory: true,
    ui: false,
    server: {
      baseDir: './test/fixtures',
    },
  };
  const httpsConfig = Object.assign({}, httpConfig, { port: 9001, https: true });

  const startBS = (config) => {
    const bs = create();
    return new Promise((resolve, reject) => {
      bs.pause();

      bs.init(config, (err) => {
        if (err) {
          reject(err);
          return;
        }
        resolve();
      });
    });
  };

  return Promise.all([startBS(httpConfig), startBS(httpsConfig)]);
}
