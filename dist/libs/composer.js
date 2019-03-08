"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResolvers = exports.addResolver = exports.addFields = exports.getTypeDefs = exports.createScalarType = exports.createEnumType = exports.createInputType = exports.createType = void 0;

var _lodash = _interopRequireDefault(require("lodash"));

var _graphqlTypeJson = _interopRequireDefault(require("graphql-type-json"));

var _UploadType = _interopRequireDefault(require("../types/UploadType"));

var _OrderType = _interopRequireDefault(require("../types/OrderType"));

var _DateType = _interopRequireDefault(require("../types/DateType"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var objects = {
  Mutation: {
    name: 'Mutation'
  },
  Query: {
    name: 'Query'
  },
  Subscription: {
    name: 'Subscription'
  }
};
var extendFields = {};
var resolvers = {};

var createType = function createType(obj) {
  var name = obj.name;
  objects[name] = obj;
};

exports.createType = createType;

var createInputType = function createInputType(obj) {
  var name = obj.name;
  objects[name] = obj;
};

exports.createInputType = createInputType;

var createEnumType = function createEnumType(obj) {
  var name = obj.name;
  objects[name] = obj;
};

exports.createEnumType = createEnumType;

var createScalarType = function createScalarType(name) {
  objects[name] = {
    type: 'scalar',
    name: name
  };
};

exports.createScalarType = createScalarType;

var getTypeDefs = function getTypeDefs() {
  var defs = '';
  Object.entries(objects).map(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        name = _ref2[0],
        obj = _ref2[1];

    var type = obj.type,
        values = obj.values;

    var fields = _objectSpread({}, obj.fields, extendFields[name]);

    var objType = type || 'type';
    defs += "".concat(objType, " ").concat(name);

    if (objType === 'scalar') {
      defs += '\n';
      return;
    }

    if (objType === 'enum') {
      defs += ' {\n';
      defs += Object.entries(values).map(function (_ref3) {
        var _ref4 = _slicedToArray(_ref3, 1),
            value = _ref4[0];

        return " ".concat(value);
      }).join('\n');
      defs += '\n}\n';
      return;
    }

    defs += ' {\n';
    Object.entries(fields).map(function (_ref5) {
      var _ref6 = _slicedToArray(_ref5, 2),
          field = _ref6[0],
          _ref6$ = _ref6[1],
          type = _ref6$.type,
          args = _ref6$.args;

      var fieldArgs = '';

      if (!_lodash.default.isEmpty(args)) {
        fieldArgs = "(".concat(Object.entries(args || {}).map(function (_ref7) {
          var _ref8 = _slicedToArray(_ref7, 2),
              k = _ref8[0],
              t = _ref8[1];

          return "".concat(k, ": ").concat(t);
        }).join(', '), ")");
      }

      defs += " ".concat(field).concat(fieldArgs, ": ").concat(type, "\n");
    });
    defs += '}\n';
  });
  return defs;
};

exports.getTypeDefs = getTypeDefs;

var addFields = function addFields(objectName, fields) {
  _lodash.default.set(extendFields, objectName, _objectSpread({}, extendFields[objectName], fields));
};

exports.addFields = addFields;

var addResolver = function addResolver(path, config) {
  return _lodash.default.set(resolvers, path, config);
};

exports.addResolver = addResolver;

var getResolvers = function getResolvers() {
  return resolvers;
};

exports.getResolvers = getResolvers;
createEnumType(_OrderType.default);
createScalarType('Date');
addResolver('Date', _DateType.default); // createScalarType('Upload');

addResolver('Upload', _UploadType.default);
createScalarType('JSON');
addResolver('JSON', _graphqlTypeJson.default);