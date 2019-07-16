"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _pluralize = _interopRequireDefault(require("pluralize"));

var _camelcase = _interopRequireDefault(require("camelcase"));

var ModelNameToTypeName = function ModelNameToTypeName(name) {
  (0, _classCallCheck2["default"])(this, ModelNameToTypeName);
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