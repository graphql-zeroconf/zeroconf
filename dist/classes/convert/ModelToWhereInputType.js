"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _lodash = _interopRequireDefault(require("lodash"));

var _getFieldType = require("../../libs/getFieldType");

var ModelToWhereInputType = function ModelToWhereInputType(model) {
  (0, _classCallCheck2["default"])(this, ModelToWhereInputType);
  var _model$options = model.options,
      createdAt = _model$options.createdAt,
      updatedAt = _model$options.updatedAt,
      rawAttributes = model.rawAttributes,
      TypeName = model.convertedName.TypeName;
  this.type = 'input';
  this.name = "".concat(TypeName, "WhereInput");
  var fields = {};

  _lodash["default"].each(rawAttributes, function (attr, key) {
    if (createdAt === key || updatedAt === key) {
      return;
    }

    var type = (0, _getFieldType.getFieldTypeForInput)(TypeName, attr);

    if (!type) {
      return;
    }

    if (attr.isPrimary) {
      type = "".concat(type, "!");
    }

    fields[attr.fieldName] = {
      type: type,
      description: attr.comment
    };
  });

  this.fields = fields;
};

module.exports = ModelToWhereInputType;