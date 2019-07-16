"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

/* eslint-disable no-debugger */
// https://facebook.github.io/graphql/June2018/#sec-Names
// For the reason of naming convension in graphql, zeroconf always allow with alphabet or underscore
var isEnumType = function isEnumType(attr) {
  var enumType = true;

  _lodash["default"].each(attr.type.values, function (value) {
    var index = value.search(/^[_A-Za-z][_0-9A-Za-z]*/);

    if (index === -1) {
      enumType = false;
      return enumType;
    }
  });

  return enumType;
};

var _default = isEnumType;
exports["default"] = _default;