"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _getFieldType = require("../../libs/getFieldType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelToObjectType = function ModelToObjectType(model) {
  _classCallCheck(this, ModelToObjectType);

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