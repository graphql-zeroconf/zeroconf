"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _possibleConstructorReturn2 = _interopRequireDefault(require("@babel/runtime/helpers/possibleConstructorReturn"));

var _getPrototypeOf2 = _interopRequireDefault(require("@babel/runtime/helpers/getPrototypeOf"));

var _inherits2 = _interopRequireDefault(require("@babel/runtime/helpers/inherits"));

var _require = require('graphql'),
    GraphQLScalarType = _require.GraphQLScalarType;

var _require2 = require('graphql/language'),
    Kind = _require2.Kind;

var DateType =
/*#__PURE__*/
function (_GraphQLScalarType) {
  (0, _inherits2["default"])(DateType, _GraphQLScalarType);

  function DateType() {
    (0, _classCallCheck2["default"])(this, DateType);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(DateType).call(this, {
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue: function parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize: function serialize(value) {
        if (value instanceof Date) {
          return value.getTime();
        }

        if (typeof value === 'number') {
          return Math.trunc(value);
        }

        if (typeof value === 'string') {
          return Date.parse(value);
        }

        return null;
      },
      parseLiteral: function parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value); // ast value is always in string format
        }

        if (ast.kind === Kind.STRING) {
          return new Date(ast.value);
        }

        return null;
      }
    }));
  }

  return DateType;
}(GraphQLScalarType);

var _default = new DateType();

exports["default"] = _default;