import _ from 'lodash';
import { getFieldTypeForInput } from '../../libs/getFieldType';

class ModelToUpdateInputType {
  constructor(model) {
    const {
      options: { createdAt, updatedAt },
      attributes,
      convertedName: { TypeName },
    } = model;

    this.type = 'input';
    this.name = `${TypeName}UpdateInput`;

    const fields = {};

    _.each(attributes, (attr, key) => {
      if (createdAt === key || updatedAt === key) {
        return;
      }

      if (attr.autoIncrement) {
        return;
      }

      let type = getFieldTypeForInput(TypeName, attr);

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

module.exports = ModelToUpdateInputType;
