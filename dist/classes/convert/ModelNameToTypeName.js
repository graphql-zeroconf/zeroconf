"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _pluralize = _interopRequireDefault(require("pluralize"));

var _camelcase = _interopRequireDefault(require("camelcase"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var ModelNameToTypeName = function ModelNameToTypeName(name) {
  _classCallCheck(this, ModelNameToTypeName);

  this.modelName = _pluralize["default"].singular(name);
  this.modelNames = _pluralize["default"].plural(name);
  this.TypeNames = (0, _camelcase["default"])(this.modelNames, {
    pascalCase: true
  });
  this.typeNames = (0, _camelcase["default"])(this.modelNames, {
    pascalCase: false
  });
  this.TypeName = (0, _camelcase["default"])(this.modelName, {
    pascalCase: true
  });
  this.typeName = (0, _camelcase["default"])(this.modelName, {
    pascalCase: false
  });
};

var _default = ModelNameToTypeName;
exports["default"] = _default;