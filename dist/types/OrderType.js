"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _ = require('lodash');

var OrderType = function OrderType() {
  (0, _classCallCheck2["default"])(this, OrderType);
  this.type = 'enum';
  this.name = 'Order';
  this.values = {
    ASC: {
      value: 'ASC'
    },
    DESC: {
      value: 'DESC'
    }
  };
};

var _default = new OrderType();

exports["default"] = _default;