class SetStatement {
  /**
   * Define set statements
   * @public
   * @param {object} defaultSetStatements - A representation where each property name will be used as key and the property will be the value
   * @constructor
   */
  constructor(defaultSetStatements) {
    this.defaultSetStatements = defaultSetStatements;
  }

  /**
   * Get the entire set statement as script
   * @public
   * @returns {string}
   */
  getScript() {
    return Object.keys(this.defaultSetStatements)
      .map(key => `SET ${key}='${Array.isArray(this.defaultSetStatements[key])
        ? this.defaultSetStatements[key].join(';') : this.defaultSetStatements[key]}';`)
      .join('\n');
  }

  /**
   * Returns the name but since statement doesn't have names it will be empty
   * @public
   * @returns {string}
   */
  getName() {
    return '';
  }
}

export default SetStatement;
