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

export function openSession(appId) {
  enigmaConfig.url = `ws://localhost:4848/app/engineData-${appId}`;
  return enigma.create(enigmaConfig).open();
}

export async function removeAllTestDoc() {
  return openSession().then(qix => qix.getDocList().then(async (list) => {
    const integrationTestDocs = list.filter(doc => doc.qDocName.match(docNamePrefix));
    const results = [];
    for (let i = 0; i < integrationTestDocs.length; i += 1) {
      results.push(qix.deleteApp(integrationTestDocs[i].qDocId));
    }
    return async () => { await Promise.all(results); };
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
