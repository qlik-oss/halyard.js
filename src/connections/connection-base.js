import { uniqueName } from '../utils/utils';

class ConnectionBase {
  /**
   * A base set of methods used by Connections
   * @param { string } path - The Path to a resource
   * @param { string } connectionType
   */
  constructor(path, connectionType) {
    this.path = path;
    this.connectionType = connectionType;
    this.fileExtension = '';
  }

  /**
   * Returns specified file extension.
   * @returns {string}
   */
  getFileExtension() {
    return this.fileExtension;
  }

  /**
   * Get specified connection type.
   * @returns {string|*}
   */
  getConnectionType() {
    return this.connectionType;
  }

  /**
   * Get the QIX representation of a connection.
   * @returns {{qName: (string), qConnectionString: (string), qType: (string)}}
   */
  getQixConnectionObject() {
    return {
      qName: this.getName(),
      qConnectionString: this.path,
      qType: this.getConnectionType(),
    };
  }

  /**
   * Get the name and if nothing is set then it will receive a unique name
   * @returns {string}
   */
  getName() {
    if (!this.name) {
      this.name = uniqueName();
    }

    return this.name;
  }

  /**
   * Get the lib statement used in the load script to connect to a connection
   * @returns {string}
   */
  getLibStatement() {
    return `lib://${this.getName()}`;
  }

  /**
   * Get the load script for this connection
   * @returns {string}
   */
  getScript() {
    return `FROM [${this.getLibStatement()}]`;
  }
}

export default ConnectionBase;
