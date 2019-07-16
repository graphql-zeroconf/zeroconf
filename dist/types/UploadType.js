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

var UploadType =
/*#__PURE__*/
function (_GraphQLScalarType) {
  (0, _inherits2["default"])(UploadType, _GraphQLScalarType);

  function UploadType() {
    (0, _classCallCheck2["default"])(this, UploadType);
    return (0, _possibleConstructorReturn2["default"])(this, (0, _getPrototypeOf2["default"])(UploadType).call(this, {
      name: 'Upload',
      description: 'Upload scalar type',
      parseValue: function parseValue(value) {
        return value;
      },
      parseLiteral: function parseLiteral() {
        throw new Error('‘Upload’ scalar literal unsupported.');
      },
      serialize: function serialize() {
        throw new Error('‘Upload’ scalar serialization unsupported.');
      }
    }));
  }

  return UploadType;
}(GraphQLScalarType);

var _default = new UploadType();

exports["default"] = _default;