import _ from 'lodash';
import { getFieldTypeForInput } from '../../libs/getFieldType';

class ModelToCreationInputType {
  constructor(model) {
    const {
      options: { createdAt, updatedAt },
      rawAttributes,
      convertedName: { TypeName },
    } = model;

    this.type = 'input';
    this.name = `${TypeName}CreationInput`;

    const fields = {};

    _.each(rawAttributes, (attr, key) => {
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
        description: attr.comment
      };
    });

    this.fields = fields;
  }
}

module.exports = ModelToCreationInputType;
