import _ from 'lodash';
import { getFieldTypeForOrder } from '../../libs/getFieldType';

class ModelToOrderInputType {
  constructor(model) {
    const {
      attributes,
      convertedName: { TypeName },
    } = model;

    this.type = 'input';
    this.name = `${TypeName}OrderInput`;

    const fields = {};

    _.each(attributes, (attr, key) => {
      fields[attr.fieldName] = {
        type: getFieldTypeForOrder(TypeName, attr),
      };
    });

    this.fields = fields;
  }
}

module.exports = ModelToOrderInputType;
