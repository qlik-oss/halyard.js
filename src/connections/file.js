import ConnectionBase from './connection-base';
import * as Utils from '../utils/utils';

class FileConnection extends ConnectionBase {
  constructor(path) {
    super(Utils.folderPath(path), 'folder');

    this.fileName = Utils.fileName(path);

    this.fileExtension = Utils.fileExtension(path) || 'txt';
  }

  getLibStatement() {
    return `${super.getLibStatement()}/${this.fileName}`;
  }
}

export default FileConnection;
