"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var _require = require('graphql'),
    GraphQLScalarType = _require.GraphQLScalarType;

var UploadType =
/*#__PURE__*/
function (_GraphQLScalarType) {
  _inherits(UploadType, _GraphQLScalarType);

  function UploadType() {
    _classCallCheck(this, UploadType);

    return _possibleConstructorReturn(this, _getPrototypeOf(UploadType).call(this, {
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