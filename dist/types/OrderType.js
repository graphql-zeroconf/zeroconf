"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var _ = require('lodash');

var OrderType = function OrderType() {
  _classCallCheck(this, OrderType);

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