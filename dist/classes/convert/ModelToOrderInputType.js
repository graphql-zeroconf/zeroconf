"use strict";

var _lodash = _interopRequireDefault(require("lodash"));

var _getFieldType = require("../../libs/getFieldType");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelToOrderInputType = function ModelToOrderInputType(model) {
  _classCallCheck(this, ModelToOrderInputType);

  var attributes = model.attributes,
      TypeName = model.convertedName.TypeName;
  this.type = 'input';
  this.name = "".concat(TypeName, "OrderInput");
  var fields = {};

  _lodash["default"].each(attributes, function (attr, key) {
    fields[attr.fieldName] = {
      type: (0, _getFieldType.getFieldTypeForOrder)(TypeName, attr)
    };
  });

  this.fields = fields;
};

module.exports = ModelToOrderInputType;