"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _defineProperty2 = _interopRequireDefault(require("@babel/runtime/helpers/defineProperty"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

/* eslint-disable no-return-await */

/* eslint-disable no-debugger */

/* eslint-disable no-restricted-syntax */
var Resolver = require('./Resolver');

var CreateResolver =
/*#__PURE__*/
function (_Resolver) {
  (0, _inherits2["default"])(CreateResolver, _Resolver);

  function CreateResolver() {
    (0, _classCallCheck2["default"])(this, CreateResolver);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(CreateResolver).apply(this, arguments));
  }

  (0, _createClass2["default"])(CreateResolver, [{
    key: "_resolve",
    value: function () {
      var _resolve2 = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(parent, args, context, info) {
        var _this$model$converted, typeName, TypeName, input, createdRow;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$model$converted = this.model.convertedName, typeName = _this$model$converted.typeName, TypeName = _this$model$converted.TypeName;
                input = args.input;

                if (this.model.options.createdAt) {
                  input[this.model.options.createdAt] = new Date();
                }

                if (this.model.options.updatedAt) {
                  input[this.model.options.updatedAt] = new Date();
                }

                _context.next = 6;
                return this.model.create(input);

              case 6:
                createdRow = _context.sent;
                this.pubSub.publish(TypeName, (0, _defineProperty2["default"])({}, typeName, createdRow));
                return _context.abrupt("return", createdRow);

              case 9:
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
  return CreateResolver;
}(Resolver);

module.exports = CreateResolver;