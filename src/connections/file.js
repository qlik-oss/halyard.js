import ConnectionBase from './connection-base';
import * as Utils from '../utils/utils';

class FileConnection extends ConnectionBase {
  /**
   * File Connection representation. It will create a folder connection in QIX.
   * @param {string} path - Absolute file path
   * @constructor
   */
  constructor(path) {
    super(Utils.folderPath(path), 'folder');

    this.fileName = Utils.fileName(path);

    this.fileExtension = Utils.fileExtension(path) || 'txt';
  }

  /**
   * Get the lib statement for the specified file path
   * @returns {string}
   */
  getLibStatement() {
    return `${super.getLibStatement()}/${this.fileName}`;
  }
}

export default FileConnection;
