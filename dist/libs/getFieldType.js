"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = exports.getFieldTypeForOrder = exports.getFieldTypeForInput = exports.getFieldTypeForObject = void 0;

var _camelcase = _interopRequireDefault(require("camelcase"));

var _isEnumType = _interopRequireDefault(require("./isEnumType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var getFieldType = function getFieldType(isInput, TypeName, attr) {
  var type = null;
  var isPrimary = attr.primaryKey;
  var dataType = attr.type.constructor.name;
  var FieldName = (0, _camelcase["default"])(attr.fieldName, {
    pascalCase: true
  });

  if (isPrimary) {
    type = 'ID';
  } else if (dataType === 'ENUM') {
    if (isInput) {
      type = (0, _isEnumType["default"])(attr) ? "".concat(TypeName).concat(FieldName) : 'String';
    } else {
      type = 'String';
    }
  } else if (dataType === 'DATE') {
    type = 'Date';
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

var getFieldTypeForObject = function getFieldTypeForObject(TypeName, attr) {
  return getFieldType(false, TypeName, attr);
};

exports.getFieldTypeForObject = getFieldTypeForObject;

var getFieldTypeForInput = function getFieldTypeForInput(TypeName, attr) {
  return getFieldType(true, TypeName, attr);
};

exports.getFieldTypeForInput = getFieldTypeForInput;

var getFieldTypeForOrder = function getFieldTypeForOrder(TypeName, attr) {
  return 'Order';
};

exports.getFieldTypeForOrder = getFieldTypeForOrder;
var _default = getFieldType;
exports["default"] = _default;