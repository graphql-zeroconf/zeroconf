"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _lodash = _interopRequireDefault(require("lodash"));

var _graphqlSubscriptions = require("graphql-subscriptions");

/* eslint-disable no-return-await */

/* eslint-disable no-debugger */

/* eslint-disable no-restricted-syntax */
var Resolver =
/*#__PURE__*/
function () {
  function Resolver(config) {
    var _this = this;

    (0, _classCallCheck2["default"])(this, Resolver);
    (0, _defineProperty2["default"])(this, "resolve",
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(parent, resolverArgs, context, info) {
        var args, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                args = resolverArgs;

                if (!_this.beforeHook) {
                  _context.next = 10;
                  break;
                }

                if (!_this.beforeHook) {
                  _context.next = 8;
                  break;
                }

                _context.next = 5;
                return _this.beforeHook(parent, resolverArgs, context, info);

              case 5:
                _context.t0 = _context.sent;
                _context.next = 9;
                break;

              case 8:
                _context.t0 = args;

              case 9:
                args = _context.t0;

              case 10:
                _context.next = 12;
                return _this._resolve(parent, args, context, info);

              case 12:
                result = _context.sent;

                if (!_this.afterHook) {
                  _context.next = 16;
                  break;
                }

                _context.next = 16;
                return _this.afterHook(parent, args, context, info);

              case 16:
                return _context.abrupt("return", result);

              case 17:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x, _x2, _x3, _x4) {
        return _ref.apply(this, arguments);
      };
    }());
    (0, _defineProperty2["default"])(this, "subscribe", function () {
      return _this._subscribe();
    });
    this.path = config.path;
    this.model = config.model;
    this.pubSub = config.pubSub;
    this.beforeHook = null;
    this.afterHook = null;

    if (config.hooks) {
      this.beforeHook = _lodash["default"].get(config.hooks, "".concat(this.path, ".before"), null);
      this.afterHook = _lodash["default"].get(config.hooks, "".concat(this.path, ".after"), null);
    }
  }

  (0, _createClass2["default"])(Resolver, [{
    key: "_resolve",
    value: function () {
      var _resolve2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2(parent, args, context, info) {
        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                return _context2.abrupt("return", null);

              case 1:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2);
      }));

      function _resolve(_x5, _x6, _x7, _x8) {
        return _resolve2.apply(this, arguments);
      }

      return _resolve;
    }()
  }, {
    key: "_subscribe",
    value: function _subscribe() {
      return null;
    }
  }, {
    key: "fetchRow",
    value: function () {
      var _fetchRow = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3(args) {
        var where, result;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                where = args.where;
                console.log(where);
                _context3.next = 4;
                return this.model.findOne({
                  where: where
                });

              case 4:
                result = _context3.sent;
                return _context3.abrupt("return", result);

              case 6:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function fetchRow(_x9) {
        return _fetchRow.apply(this, arguments);
      }

      return fetchRow;
    }()
  }, {
    key: "fetchList",
    value: function () {
      var _fetchList = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4(args) {
        var where, offset, limit, order, result;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                where = args.where, offset = args.start, limit = args.limit, order = args.order;
                _context4.next = 3;
                return this.model.findAll({
                  where: where,
                  offset: offset,
                  limit: limit,
                  order: _lodash["default"].toPairs(order)
                });

              case 3:
                result = _context4.sent;
                return _context4.abrupt("return", result);

              case 5:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function fetchList(_x10) {
        return _fetchList.apply(this, arguments);
      }

      return fetchList;
    }()
  }]);
  return Resolver;
}();

module.exports = Resolver;