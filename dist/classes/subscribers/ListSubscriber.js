"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _Resolver2 = _interopRequireDefault(require("../resolvers/Resolver"));

var ListSubscriber =
/*#__PURE__*/
function (_Resolver) {
  (0, _inherits2["default"])(ListSubscriber, _Resolver);

  function ListSubscriber() {
    (0, _classCallCheck2["default"])(this, ListSubscriber);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(ListSubscriber).apply(this, arguments));
  }

  (0, _createClass2["default"])(ListSubscriber, [{
    key: "_resolve",
    value: function () {
      var _resolve2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(parent, args, context, info) {
        var result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return this.fetchList(args);

              case 2:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 4:
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
  }, {
    key: "_subscribe",
    value: function _subscribe() {
      var TypeName = this.model.convertedName.TypeName;
      return this.pubSub.asyncIterator(TypeName);
    }
  }]);
  return ListSubscriber;
}(_Resolver2["default"]);

var _default = ListSubscriber;
exports["default"] = _default;