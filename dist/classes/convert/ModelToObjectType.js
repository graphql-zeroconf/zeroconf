"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _lodash = _interopRequireDefault(require("lodash"));

var _getFieldType = require("../../libs/getFieldType");

/* eslint-disable no-debugger */
var ModelToObjectType = function ModelToObjectType(model) {
  (0, _classCallCheck2["default"])(this, ModelToObjectType);
  var rawAttributes = model.rawAttributes,
      TypeName = model.convertedName.TypeName;
  this.name = TypeName;
  var fields = {};

  _lodash["default"].each(rawAttributes, function (attr, key) {
    var type = (0, _getFieldType.getFieldTypeForObject)(TypeName, attr);

    if (!type) {
      return;
    }

    if (!attr.allowNull) {
      type = "".concat(type, "!");
    }

    fields[attr.fieldName] = {
      type: type,
      description: attr.comment
    };
  });

  this.fields = fields;
};

module.exports = ModelToObjectType;