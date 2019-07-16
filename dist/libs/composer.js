"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getResolvers = exports.addResolver = exports.addFields = exports.getTypeDefs = exports.createScalarType = exports.createEnumType = exports.createInputType = exports.createType = void 0;

var _typeof2 = _interopRequireDefault(require("@babel/runtime/helpers/typeof"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _lodash = _interopRequireDefault(require("lodash"));

var _graphqlTypeJson = _interopRequireDefault(require("graphql-type-json"));

var _graphqlBigint = _interopRequireDefault(require("graphql-bigint"));

var _OrderType = _interopRequireDefault(require("../types/OrderType"));

var _DateType = _interopRequireDefault(require("../types/DateType"));

var objects = {
  Mutation: {
    name: "Mutation"
  },
  Query: {
    name: "Query"
  },
  Subscription: {
    name: "Subscription"
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
    type: "scalar",
    name: name
  };
};

exports.createScalarType = createScalarType;

var getTypeDefs = function getTypeDefs() {
  var defs = "";
  Object.entries(objects).map(function (_ref) {
    var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
        name = _ref2[0],
        obj = _ref2[1];

    var fields = (0, _objectSpread2["default"])({}, obj.fields, extendFields[name]);

    if (obj.description) {
      console.log(obj.description);
      defs += "\"\"\"\n".concat(obj.description.replace(/\n/g, "\n"), "\n\"\"\"\n");
    }

    var objType = obj.type || "type";
    defs += "".concat(objType, " ").concat(name);

    if (obj["implements"]) {
      defs += " implements ".concat(obj["implements"]);
    }

    if (objType === "scalar") {
      defs += "\n";
      return;
    }

    if (objType === "enum") {
      defs += " {\n";
      defs += Object.entries(obj.values).map(function (_ref3) {
        var _ref4 = (0, _slicedToArray2["default"])(_ref3, 1),
            value = _ref4[0];

        return " ".concat(value);
      }).join("\n");
      defs += "\n}\n";
      return;
    }

    defs += " {\n";
    Object.entries(fields).map(function (_ref5) {
      var _ref6 = (0, _slicedToArray2["default"])(_ref5, 2),
          field = _ref6[0],
          _ref6$ = _ref6[1],
          type = _ref6$.type,
          args = _ref6$.args,
          description = _ref6$.description;

      var fieldArgs = "";

      if (!_lodash["default"].isEmpty(args)) {
        var tmp = [];
        Object.entries(args || {}).forEach(function (_ref7) {
          var _ref8 = (0, _slicedToArray2["default"])(_ref7, 2),
              k = _ref8[0],
              t = _ref8[1];

          if (typeof t === "string") {
            tmp.push("\t\t".concat(k, ": ").concat(t));
          }

          if ((0, _typeof2["default"])(t) === "object") {
            if (t.description) {
              tmp.push('\t\t"""');
              tmp.push("\t\t".concat(t.description));
              tmp.push('\t\t"""');
            }

            tmp.push("\t\t".concat(k, ": ").concat(t.type));
          }
        });
        fieldArgs = "(\n".concat(tmp.join("\n "), "\n\t)");
      }

      if (description && typeof description === "string") {
        defs += "\"\"\"\n".concat(description.replace(/\n/g, "\n"), "\n\"\"\"\n");
      }

      defs += "\t".concat(field).concat(fieldArgs, ": ").concat(type, "\n");
    });
    defs += "}\n";
  });
  return defs;
};

exports.getTypeDefs = getTypeDefs;

var addFields = function addFields(objectName, fields) {
  _lodash["default"].set(extendFields, objectName, (0, _objectSpread2["default"])({}, extendFields[objectName], fields));
};

exports.addFields = addFields;

var addResolver = function addResolver(path, config) {
  return _lodash["default"].set(resolvers, path, config);
};

exports.addResolver = addResolver;

var getResolvers = function getResolvers() {
  return resolvers;
};

exports.getResolvers = getResolvers;
createEnumType(_OrderType["default"]);
createScalarType("Date");
addResolver("Date", _DateType["default"]);
createScalarType("JSON");
addResolver("JSON", _graphqlTypeJson["default"]);
createScalarType("BigInt");
addResolver("BigInt", _graphqlBigint["default"]);