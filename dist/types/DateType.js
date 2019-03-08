"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('graphql'),
    GraphQLScalarType = _require.GraphQLScalarType;

var _require2 = require('graphql/language'),
    Kind = _require2.Kind;

var DateType =
/*#__PURE__*/
function (_GraphQLScalarType) {
  _inherits(DateType, _GraphQLScalarType);

  function DateType() {
    _classCallCheck(this, DateType);

    return _possibleConstructorReturn(this, _getPrototypeOf(DateType).call(this, {
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue: function parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize: function serialize(value) {
        return value.getTime(); // value sent to the client
      },
      parseLiteral: function parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value); // ast value is always in string format
        }

        return null;
      }
    }));
  }

  return DateType;
}(GraphQLScalarType);

var _default = new DateType();

exports.default = _default;