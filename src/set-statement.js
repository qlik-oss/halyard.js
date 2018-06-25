class SetStatement {
  constructor(defaultSetStatements) {
    this.defaultSetStatements = defaultSetStatements;
  }

  getScript() {
    return Object.keys(this.defaultSetStatements)
      .map(key => `SET ${key}='${Array.isArray(this.defaultSetStatements[key])
        ? this.defaultSetStatements[key].join(';') : this.defaultSetStatements[key]}';`)
      .join('\n');
  }

  getName() {
    return '';
  }
}

export default SetStatement;
