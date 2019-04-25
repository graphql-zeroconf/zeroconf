/* eslint-disable no-debugger */
import _ from 'lodash';
import { getFieldTypeForObject } from '../../libs/getFieldType';

class ModelToObjectType {
  constructor(model) {
    const {
      rawAttributes,
      convertedName: { TypeName },
    } = model;

    this.name = TypeName;
    const fields = {};

    _.each(rawAttributes, (attr, key) => {
      let type = getFieldTypeForObject(TypeName, attr);

      if (!type) {
        return;
      }

      if (!attr.allowNull) {
        type = `${type}!`;
      }

      fields[attr.fieldName] = {
        type,
      };
    });

    this.fields = fields;
  }
}

module.exports = ModelToObjectType;
