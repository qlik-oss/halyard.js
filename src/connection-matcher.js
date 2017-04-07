class ConnectionLookup {
  constructor() {
    this.connectionsRegistry = [];
  }

  addConnection(matchingFn, connection) {
    this.connectionsRegistry.push({
      matchingFn,
      connection,
    });
  }

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
