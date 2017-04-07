import { uniqueName } from '../utils/utils';

class ConnectionBase {
  constructor(path, connectionType) {
    this.path = path;
    this.connectionType = connectionType;
    this.fileExtension = '';
  }

  getFileExtension() {
    return this.fileExtension;
  }

  getConnectionType() {
    return this.connectionType;
  }

  getQixConnectionObject() {
    return {
      qName: this.getName(),
      qConnectionString: this.path,
      qType: this.getConnectionType(),
    };
  }

  getName() {
    if (!this.name) {
      this.name = uniqueName();
    }

    return this.name;
  }

  getLibStatement() {
    return `lib://${this.getName()}`;
  }

  getScript() {
    return `FROM [${this.getLibStatement()}]`;
  }
}

export default ConnectionBase;
