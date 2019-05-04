import _ from 'lodash';
import { getFieldTypeForOrder } from '../../libs/getFieldType';

class ModelToOrderInputType {
  constructor(model) {
    const {
      rawAttributes,
      convertedName: { TypeName },
    } = model;

    this.type = 'input';
    this.name = `${TypeName}OrderInput`;

    const fields = {};

    _.each(rawAttributes, (attr, key) => {
      fields[attr.fieldName] = {
        type: getFieldTypeForOrder(TypeName, attr),
        description: attr.comment
      };
    });

    this.fields = fields;
  }
}

module.exports = ModelToOrderInputType;
