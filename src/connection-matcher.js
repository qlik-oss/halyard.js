class ConnectionLookup {
  /**
   * Utility to add a matching function and a connection type to make it easier to implicitly choose a connection
   * @private
   * @constructor
   */
  constructor() {
    this.connectionsRegistry = [];
  }

  /**
   * Add a matching function with a connection instance
   * @private
   * @param matchingFn - Matching function to decide what connection function to invoke
   * @param connectionFn - Should return a connection instance
   */
  addConnection(matchingFn, connection) {
    this.connectionsRegistry.push({
      matchingFn,
      connection,
    });
  }

  /**
   * Find a match for connection based on the input data
   * @private
   * @param {string} data - Url, file path, csv data
   * @returns {object}
   */
  findMatch(data) {
    for (let i = 0; i < this.connectionsRegistry.length; i += 1) {
      if (this.connectionsRegistry[i].matchingFn(data)) {
        return this.connectionsRegistry[i].connection(data);
      }
    }

    return data;
  }
}

export default ConnectionLookup;
