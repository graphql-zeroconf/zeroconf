"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _lodash = _interopRequireDefault(require("lodash"));

var _camelcase = _interopRequireDefault(require("camelcase"));

var FieldToEnumType = function FieldToEnumType(TypeName, attr) {
  (0, _classCallCheck2["default"])(this, FieldToEnumType);
  var FieldName = (0, _camelcase["default"])(attr.fieldName, {
    pascalCase: true
  });
  var values = {};

  _lodash["default"].each(attr.type.values, function (value) {
    values[value] = {
      value: value
    };
  });

  this.type = 'enum';
  this.name = "".concat(TypeName).concat(FieldName);
  this.values = values;
};

var _default = FieldToEnumType;
exports["default"] = _default;