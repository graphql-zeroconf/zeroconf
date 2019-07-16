"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _lodash = _interopRequireDefault(require("lodash"));

var _getFieldType = require("../../libs/getFieldType");

var ModelToCreationInputType = function ModelToCreationInputType(model) {
  (0, _classCallCheck2["default"])(this, ModelToCreationInputType);
  var _model$options = model.options,
      createdAt = _model$options.createdAt,
      updatedAt = _model$options.updatedAt,
      rawAttributes = model.rawAttributes,
      TypeName = model.convertedName.TypeName;
  this.type = 'input';
  this.name = "".concat(TypeName, "CreationInput");
  var fields = {};

  _lodash["default"].each(rawAttributes, function (attr, key) {
    if (createdAt === key || updatedAt === key) {
      return;
    }

    if (attr.autoIncrement) {
      return;
    }

    var type = (0, _getFieldType.getFieldTypeForInput)(TypeName, attr);

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

module.exports = ModelToCreationInputType;