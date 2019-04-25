"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _getFieldType = require("../../libs/getFieldType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelToWhereInputType = function ModelToWhereInputType(model) {
  _classCallCheck(this, ModelToWhereInputType);

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
      type: type
    };
  });

  this.fields = fields;
};

module.exports = ModelToWhereInputType;