import { getFieldName, escapeText } from './utils/utils';

class DerivedFieldsTemplate {
  /**
   * Declare fields that can be derived from a template. An example can be a calendar template.
   * @public
   * @param {object} options - Derived Field Template definition.
   * @param {callback} fieldMatchFunction - Matching function that will apply a field template definition.
   * @param {string} name - Name of derived field.
   * @param {string} fieldTag - What field tag that will be used in the derived field.
   * @param {string} derivedFieldDefinition - What script definition should be used in the derived field.
   * @constructor
   */
  constructor(options) {
    this.getFieldFn = options.fieldMatchFunction;
    this.name = options.name;
    this.fieldTag = options.fieldTag;
    this.derivedFieldDefinition = options.derivedFieldDefinition;
  }

  /**
   * Returns the script
   * @public
   * @returns {string}
   */
  getScript() {
    const fields = this.getFieldFn() || [];

    if (fields.length > 0) {
      return this.getDefinition(fields.map(getFieldName));
    }

    return undefined;
  }

  /**
   * Get the script definition for a set of specific fields
   * @public
   * @param {string[]} fieldNames - An array of strings with field names.
   * @returns {string}
   */
  getDefinition(fieldNames) {
    return `"${escapeText(this.name)}":
DECLARE FIELD DEFINITION Tagged ('$${this.fieldTag}')
FIELDS
${this.derivedFieldDefinition}
DERIVE FIELDS FROM FIELDS [${fieldNames.join(', ')}] USING "${escapeText(this.name)}";`;
  }
}

export default DerivedFieldsTemplate;
