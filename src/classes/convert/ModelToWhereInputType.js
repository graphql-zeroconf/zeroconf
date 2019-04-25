import _ from 'lodash';
import { getFieldTypeForInput } from '../../libs/getFieldType';

class ModelToWhereInputType {
  constructor(model) {
    const {
      options: { createdAt, updatedAt },
      rawAttributes,
      convertedName: { TypeName },
    } = model;

    this.type = 'input';
    this.name = `${TypeName}WhereInput`;

    const fields = {};

    _.each(rawAttributes, (attr, key) => {
      if (createdAt === key || updatedAt === key) {
        return;
      }

      let type = getFieldTypeForInput(TypeName, attr);

      if (!type) {
        return;
      }

      if (attr.isPrimary) {
        type = `${type}!`;
      }

      fields[attr.fieldName] = {
        type,
      };
    });

    this.fields = fields;
  }
}

module.exports = ModelToWhereInputType;
