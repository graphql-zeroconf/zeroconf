import _ from 'lodash';
import camelCase from 'camelcase';

class FieldToEnumType {
  constructor(TypeName, attr) {
    const FieldName = camelCase(attr.fieldName, { pascalCase: true });

    const values = {};
    _.each(attr.type.values, (value) => {
      values[value] = { value };
    });

    this.type = 'enum';
    this.name = `${TypeName}${FieldName}`;
    this.values = values;
  }
}

export default FieldToEnumType;
