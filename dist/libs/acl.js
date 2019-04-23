"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _acl = _interopRequireDefault(require("acl"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var _default = new _acl["default"](new _acl["default"].memoryBackend());

exports["default"] = _default;