"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _lodash = _interopRequireDefault(require("lodash"));

var _getFieldType = require("../../libs/getFieldType");

var ModelToOrderInputType = function ModelToOrderInputType(model) {
  (0, _classCallCheck2["default"])(this, ModelToOrderInputType);
  var rawAttributes = model.rawAttributes,
      TypeName = model.convertedName.TypeName;
  this.type = 'input';
  this.name = "".concat(TypeName, "OrderInput");
  var fields = {};

  _lodash["default"].each(rawAttributes, function (attr, key) {
    fields[attr.fieldName] = {
      type: (0, _getFieldType.getFieldTypeForOrder)(TypeName, attr),
      description: attr.comment
    };
  });

  this.fields = fields;
};

module.exports = ModelToOrderInputType;