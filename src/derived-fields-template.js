import { getFieldName, escapeText } from './utils/utils';

class DerivedFieldsTemplate {
  constructor(options) {
    this.getFieldFn = options.fieldMatchFunction;
    this.name = options.name;
    this.fieldTag = options.fieldTag;
    this.derivedFieldDefinition = options.derivedFieldDefinition;
  }

  getScript() {
    const fields = this.getFieldFn() || [];

    if (fields.length > 0) {
      return this.getDefinition(fields.map(getFieldName));
    }

    return undefined;
  }

  getDefinition(fieldNames) {
    return `"${escapeText(this.name)}":
DECLARE FIELD DEFINITION Tagged ('$${this.fieldTag}')
FIELDS
${this.derivedFieldDefinition}
DERIVE FIELDS FROM FIELDS [${fieldNames.join(', ')}] USING "${escapeText(this.name)}";`;
  }
}

export default DerivedFieldsTemplate;
