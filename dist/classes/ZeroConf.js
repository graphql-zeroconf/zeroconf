"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _classCallCheck2 = _interopRequireDefault(require("@babel/runtime/helpers/classCallCheck"));

var _createClass2 = _interopRequireDefault(require("@babel/runtime/helpers/createClass"));

var _lodash = _interopRequireDefault(require("lodash"));

var _path = _interopRequireDefault(require("path"));

var _sequelize = _interopRequireDefault(require("sequelize"));

var _graphqlSubscriptions = require("graphql-subscriptions");

var _acl = _interopRequireDefault(require("../libs/acl"));

var _loader = _interopRequireDefault(require("../libs/loader"));

var _generator = _interopRequireDefault(require("../libs/generator"));

var _composer = require("../libs/composer");

var _isEnumType = _interopRequireDefault(require("../libs/isEnumType"));

var _UploadType = _interopRequireDefault(require("../types/UploadType"));

var _ModelToObjectType = _interopRequireDefault(require("./convert/ModelToObjectType"));

var _ModelToWhereInputType = _interopRequireDefault(require("./convert/ModelToWhereInputType"));

var _ModelToCreationInputType = _interopRequireDefault(require("./convert/ModelToCreationInputType"));

var _ModelToUpdateInputType = _interopRequireDefault(require("./convert/ModelToUpdateInputType"));

var _ModelToOrderInputType = _interopRequireDefault(require("./convert/ModelToOrderInputType"));

var _ModelNameToTypeName = _interopRequireDefault(require("./convert/ModelNameToTypeName"));

var _FieldToEnumType = _interopRequireDefault(require("./convert/FieldToEnumType"));

/* eslint-disable no-debugger */
var models = require(_path["default"].resolve("models"));

var Op = _sequelize["default"].Op;
var operatorsAliases = {
  eq: Op.eq,
  ne: Op.ne,
  gte: Op.gte,
  gt: Op.gt,
  lte: Op.lte,
  lt: Op.lt,
  not: Op.not,
  "in": Op["in"],
  notIn: Op.notIn,
  is: Op.is,
  like: Op.like,
  notLike: Op.notLike,
  iLike: Op.iLike,
  notILike: Op.notILike,
  regexp: Op.regexp,
  notRegexp: Op.notRegexp,
  iRegexp: Op.iRegexp,
  notIRegexp: Op.notIRegexp,
  between: Op.between,
  notBetween: Op.notBetween,
  overlap: Op.overlap,
  contains: Op.contains,
  contained: Op.contained,
  adjacent: Op.adjacent,
  strictLeft: Op.strictLeft,
  strictRight: Op.strictRight,
  noExtendRight: Op.noExtendRight,
  noExtendLeft: Op.noExtendLeft,
  and: Op.and,
  or: Op.or,
  any: Op.any,
  all: Op.all,
  values: Op.values,
  col: Op.col
};

var ZeroConf =
/*#__PURE__*/
function () {
  function ZeroConf(config) {
    (0, _classCallCheck2["default"])(this, ZeroConf);
    this.hooks = {};
    this.queryExtends = [];
    this.models = {};
    this.graphiql = true;

    if (config.context) {
      this.setContext(config.context);
      delete config.context;
    }

    if (config.allows) {
      _acl["default"].allow(config.allows);

      this.acl = _acl["default"];
    }

    for (var _i = 0, _Object$keys = Object.keys(config); _i < _Object$keys.length; _i++) {
      var key = _Object$keys[_i];
      this[key] = config[key];
    }

    this.pubSub = new _graphqlSubscriptions.PubSub();

    if (config.withApollo !== true) {
      (0, _composer.createScalarType)("Upload");
      (0, _composer.addResolver)("Upload", _UploadType["default"]);
    }
  }

  (0, _createClass2["default"])(ZeroConf, [{
    key: "composeEnumType",
    value: function composeEnumType(model) {
      var rawAttributes = model.rawAttributes,
          TypeName = model.convertedName.TypeName;

      _lodash["default"].each(rawAttributes, function (attr, key) {
        var dataType = attr.type.constructor.name;

        if (dataType !== "ENUM") {
          return;
        }

        if (!(0, _isEnumType["default"])(attr)) {
          return;
        }

        (0, _composer.createEnumType)(new _FieldToEnumType["default"](TypeName, attr));
      });
    }
  }, {
    key: "composeGraphQLObject",
    value: function composeGraphQLObject() {
      var _this = this;

      Object.values(this.models).forEach(function (model) {
        _this.composeEnumType(model);

        (0, _composer.createType)(new _ModelToObjectType["default"](model));
        (0, _composer.createInputType)(new _ModelToCreationInputType["default"](model));
        (0, _composer.createInputType)(new _ModelToUpdateInputType["default"](model));
        (0, _composer.createInputType)(new _ModelToWhereInputType["default"](model));
        (0, _composer.createInputType)(new _ModelToOrderInputType["default"](model));
      });
    }
  }, {
    key: "generateModel",
    value: function () {
      var _generateModel = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee() {
        var _this2 = this;

        var _this$sequelizeConfig, database, user, password, option;

        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$sequelizeConfig = this.sequelizeConfig, database = _this$sequelizeConfig.database, user = _this$sequelizeConfig.user, password = _this$sequelizeConfig.password, option = _this$sequelizeConfig.option;
                this.sequelize = new _sequelize["default"](database, user, password, (0, _objectSpread2["default"])({
                  operatorsAliases: operatorsAliases
                }, option));
                Object.entries(models).forEach(function (_ref) {
                  var _ref2 = (0, _slicedToArray2["default"])(_ref, 2),
                      modelName = _ref2[0],
                      definition = _ref2[1];

                  var model = _this2.sequelize["import"](modelName, definition);

                  model.convertedName = new _ModelNameToTypeName["default"](modelName);
                  _this2.models[modelName] = model;
                });

              case 3:
              case "end":
                return _context.stop();
            }
          }
        }, _callee, this);
      }));

      function generateModel() {
        return _generateModel.apply(this, arguments);
      }

      return generateModel;
    }()
  }, {
    key: "setContext",
    value: function setContext(func) {
      var _this3 = this;

      this.context = function (args) {
        return func.apply(_this3, [args, _this3.models, _this3.acl]);
      };
    }
  }, {
    key: "initHooks",
    value: function () {
      var _initHooks = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee2() {
        var hookDefs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, type, name, when, hook;

        return _regenerator["default"].wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.hooksPath) === true)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                hookDefs = null;

                if (!(typeof this.hooksPath === "string")) {
                  _context2.next = 9;
                  break;
                }

                _context2.next = 6;
                return (0, _loader["default"])(this.hooksPath);

              case 6:
                hookDefs = _context2.sent;
                _context2.next = 10;
                break;

              case 9:
                hookDefs = this.hooksPath;

              case 10:
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 13;

                for (_iterator = hookDefs[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _step$value = _step.value, type = _step$value.type, name = _step$value.name, when = _step$value.when, hook = _step$value.hook;

                  _lodash["default"].set(this.hooks, "".concat(type, ".").concat(name, ".").concat(when), hook);
                }

                _context2.next = 21;
                break;

              case 17:
                _context2.prev = 17;
                _context2.t0 = _context2["catch"](13);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 21:
                _context2.prev = 21;
                _context2.prev = 22;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 24:
                _context2.prev = 24;

                if (!_didIteratorError) {
                  _context2.next = 27;
                  break;
                }

                throw _iteratorError;

              case 27:
                return _context2.finish(24);

              case 28:
                return _context2.finish(21);

              case 29:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[13, 17, 21, 29], [22,, 24, 28]]);
      }));

      function initHooks() {
        return _initHooks.apply(this, arguments);
      }

      return initHooks;
    }()
  }, {
    key: "initExtends",
    value: function () {
      var _initExtends = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee3() {
        var queryExtends;
        return _regenerator["default"].wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.extendsPath) === true)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                queryExtends = null;

                if (!(typeof this.extendsPath === "string")) {
                  _context3.next = 9;
                  break;
                }

                _context3.next = 6;
                return (0, _loader["default"])(this.extendsPath);

              case 6:
                queryExtends = _context3.sent;
                _context3.next = 10;
                break;

              case 9:
                queryExtends = this.extendsPath;

              case 10:
                this.queryExtends = [].concat((0, _toConsumableArray2["default"])(this.queryExtends), (0, _toConsumableArray2["default"])(queryExtends));

              case 11:
              case "end":
                return _context3.stop();
            }
          }
        }, _callee3, this);
      }));

      function initExtends() {
        return _initExtends.apply(this, arguments);
      }

      return initExtends;
    }()
  }, {
    key: "initTypes",
    value: function () {
      var _initTypes = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee4() {
        var types;
        return _regenerator["default"].wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.typesPath) === true)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return");

              case 2:
                types = null;

                if (!(typeof this.typesPath === "string")) {
                  _context4.next = 9;
                  break;
                }

                _context4.next = 6;
                return (0, _loader["default"])(this.typesPath);

              case 6:
                types = _context4.sent;
                _context4.next = 10;
                break;

              case 9:
                types = this.typesPath;

              case 10:
                types.map(function (type) {
                  (0, _composer.createType)(type);
                });

              case 11:
              case "end":
                return _context4.stop();
            }
          }
        }, _callee4, this);
      }));

      function initTypes() {
        return _initTypes.apply(this, arguments);
      }

      return initTypes;
    }()
  }, {
    key: "use",
    value: function () {
      var _use = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee5(module) {
        var _this4 = this;

        return _regenerator["default"].wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (module.hooks) {
                  module.hooks.map(function (type) {
                    var _iteratorNormalCompletion2 = true;
                    var _didIteratorError2 = false;
                    var _iteratorError2 = undefined;

                    try {
                      for (var _iterator2 = module.hooks[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var _step2$value = _step2.value,
                            _type = _step2$value.type,
                            name = _step2$value.name,
                            when = _step2$value.when,
                            hook = _step2$value.hook;

                        _lodash["default"].set(_this4.hooks, "".concat(_type, ".").concat(name, ".").concat(when), hook);
                      }
                    } catch (err) {
                      _didIteratorError2 = true;
                      _iteratorError2 = err;
                    } finally {
                      try {
                        if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
                          _iterator2["return"]();
                        }
                      } finally {
                        if (_didIteratorError2) {
                          throw _iteratorError2;
                        }
                      }
                    }
                  });
                }

                if (module.types) {
                  module.types.map(function (type) {
                    (0, _composer.createType)(type);
                  });
                }

                if (module["extends"]) {
                  this.queryExtends = [].concat((0, _toConsumableArray2["default"])(this.queryExtends), (0, _toConsumableArray2["default"])(module["extends"]));
                }

              case 3:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
      }));

      function use(_x) {
        return _use.apply(this, arguments);
      }

      return use;
    }()
  }, {
    key: "configuration",
    value: function () {
      var _configuration = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee6() {
        return _regenerator["default"].wrap(function _callee6$(_context6) {
          while (1) {
            switch (_context6.prev = _context6.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.sequelizeConfig) === true)) {
                  _context6.next = 2;
                  break;
                }

                throw new Error("node sequelize configutration needed");

              case 2:
                _context6.next = 4;
                return this.generateModel();

              case 4:
                _context6.next = 6;
                return this.initHooks();

              case 6:
                _context6.next = 8;
                return this.initTypes();

              case 8:
                this.composeGraphQLObject();
                (0, _generator["default"])(this, "Query");
                (0, _generator["default"])(this, "Subscription");
                (0, _generator["default"])(this, "Mutation");
                (0, _generator["default"])(this, "Children");
                _context6.next = 15;
                return this.initExtends();

              case 15:
                (0, _generator["default"])(this, "QueryExtends");
                this.typeDefs = (0, _composer.getTypeDefs)();
                this.resolvers = (0, _composer.getResolvers)();

              case 18:
              case "end":
                return _context6.stop();
            }
          }
        }, _callee6, this);
      }));

      function configuration() {
        return _configuration.apply(this, arguments);
      }

      return configuration;
    }()
  }]);
  return ZeroConf;
}();

module.exports = ZeroConf;