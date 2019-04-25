import camelCase from 'camelcase';

import isEnumType from './isEnumType';

const getFieldType = (isInput, TypeName, attr) => {
  let type = null;

  const isPrimary = attr.primaryKey;
  const dataType = attr.type.constructor.name;
  const FieldName = camelCase(attr.fieldName, { pascalCase: true });

  if (isPrimary) {
    type = 'ID';
  } else if (dataType === 'ENUM') {
    if (isInput) {
      type = isEnumType(attr) ? `${TypeName}${FieldName}` : 'String';
    } else {
      type = 'String';
    }
  } else if (dataType === 'DATE') {
    type = 'Date';
  } else if (dataType.indexOf('BIGINT') > -1) {
    type = 'BigInt';
  } else if (dataType.indexOf('INT') > -1) {
    type = 'Int';
  } else if (dataType === 'DECIMAL') {
    type = 'Float';
  } else if (dataType.indexOf('BOOL') > -1) {
    type = 'Boolean';
  } else {
    type = 'String';
  }

  return type;
};

export const getFieldTypeForObject = (TypeName, attr) => getFieldType(false, TypeName, attr);
export const getFieldTypeForInput = (TypeName, attr) => getFieldType(true, TypeName, attr);
export const getFieldTypeForOrder = (TypeName, attr) => 'Order';

export default getFieldType;
