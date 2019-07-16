"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _acl = _interopRequireDefault(require("acl"));

var _default = new _acl["default"](new _acl["default"].memoryBackend());

exports["default"] = _default;