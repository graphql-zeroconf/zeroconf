"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _camelcase = _interopRequireDefault(require("camelcase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var FieldToEnumType = function FieldToEnumType(TypeName, attr) {
  _classCallCheck(this, FieldToEnumType);

  var FieldName = (0, _camelcase.default)(attr.fieldName, {
    pascalCase: true
  });
  var values = {};

  _lodash.default.each(attr.type.values, function (value) {
    values[value] = {
      value: value
    };
  });

  this.type = 'enum';
  this.name = "".concat(TypeName).concat(FieldName);
  this.values = values;
};

var _default = FieldToEnumType;
exports.default = _default;