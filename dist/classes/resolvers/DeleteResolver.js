"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

/* eslint-disable no-return-await */

/* eslint-disable no-debugger */

/* eslint-disable no-restricted-syntax */
var Resolver = require("./Resolver");

var _ = require("lodash");

var DeleteResolver =
/*#__PURE__*/
function (_Resolver) {
  (0, _inherits2["default"])(DeleteResolver, _Resolver);

  function DeleteResolver() {
    (0, _classCallCheck2["default"])(this, DeleteResolver);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DeleteResolver).apply(this, arguments));
  }

  (0, _createClass2["default"])(DeleteResolver, [{
    key: "_resolve",
    value: function () {
      var _resolve2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(parent, args, context, info) {
        var where, result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                where = args.where;

                if (!(_.isEmpty(where) === true)) {
                  _context.next = 3;
                  break;
                }

                throw new Error("Invalid where syntax");

              case 3:
                _context.next = 5;
                return this.model.destroy({
                  where: where
                });

              case 5:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 7:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function _resolve(_x, _x2, _x3, _x4) {
        return _resolve2.apply(this, arguments);
      }

      return _resolve;
    }()
  }]);
  return DeleteResolver;
}(Resolver);

module.exports = DeleteResolver;