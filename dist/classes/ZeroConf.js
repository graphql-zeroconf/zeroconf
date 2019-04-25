"use strict";

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

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; var ownKeys = Object.keys(source); if (typeof Object.getOwnPropertySymbols === 'function') { ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) { return Object.getOwnPropertyDescriptor(source, sym).enumerable; })); } ownKeys.forEach(function (key) { _defineProperty(target, key, source[key]); }); } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var models = require(_path["default"].resolve('models'));

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
    _classCallCheck(this, ZeroConf);

    this.hooks = {};
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
      (0, _composer.createScalarType)('Upload');
      (0, _composer.addResolver)('Upload', _UploadType["default"]);
    }
  }

  _createClass(ZeroConf, [{
    key: "composeEnumType",
    value: function composeEnumType(model) {
      var rawAttributes = model.rawAttributes,
          TypeName = model.convertedName.TypeName;

      _lodash["default"].each(rawAttributes, function (attr, key) {
        var dataType = attr.type.constructor.name;

        if (dataType !== 'ENUM') {
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
      var _generateModel = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee() {
        var _this2 = this;

        var _this$sequelizeConfig, database, user, password, option;

        return regeneratorRuntime.wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _this$sequelizeConfig = this.sequelizeConfig, database = _this$sequelizeConfig.database, user = _this$sequelizeConfig.user, password = _this$sequelizeConfig.password, option = _this$sequelizeConfig.option;
                this.sequelize = new _sequelize["default"](database, user, password, _objectSpread({
                  operatorsAliases: operatorsAliases
                }, option));
                Object.entries(models).forEach(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
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
      var _initHooks = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee2() {
        var hookDefs, _iteratorNormalCompletion, _didIteratorError, _iteratorError, _iterator, _step, _step$value, type, name, when, hook;

        return regeneratorRuntime.wrap(function _callee2$(_context2) {
          while (1) {
            switch (_context2.prev = _context2.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.hooksPath) === true)) {
                  _context2.next = 2;
                  break;
                }

                return _context2.abrupt("return");

              case 2:
                _context2.next = 4;
                return (0, _loader["default"])(this.hooksPath);

              case 4:
                hookDefs = _context2.sent;
                _iteratorNormalCompletion = true;
                _didIteratorError = false;
                _iteratorError = undefined;
                _context2.prev = 8;

                for (_iterator = hookDefs[Symbol.iterator](); !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                  _step$value = _step.value, type = _step$value.type, name = _step$value.name, when = _step$value.when, hook = _step$value.hook;

                  _lodash["default"].set(this.hooks, "".concat(type, ".").concat(name, ".").concat(when), hook);
                }

                _context2.next = 16;
                break;

              case 12:
                _context2.prev = 12;
                _context2.t0 = _context2["catch"](8);
                _didIteratorError = true;
                _iteratorError = _context2.t0;

              case 16:
                _context2.prev = 16;
                _context2.prev = 17;

                if (!_iteratorNormalCompletion && _iterator["return"] != null) {
                  _iterator["return"]();
                }

              case 19:
                _context2.prev = 19;

                if (!_didIteratorError) {
                  _context2.next = 22;
                  break;
                }

                throw _iteratorError;

              case 22:
                return _context2.finish(19);

              case 23:
                return _context2.finish(16);

              case 24:
              case "end":
                return _context2.stop();
            }
          }
        }, _callee2, this, [[8, 12, 16, 24], [17,, 19, 23]]);
      }));

      function initHooks() {
        return _initHooks.apply(this, arguments);
      }

      return initHooks;
    }()
  }, {
    key: "initExtends",
    value: function () {
      var _initExtends = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee3() {
        return regeneratorRuntime.wrap(function _callee3$(_context3) {
          while (1) {
            switch (_context3.prev = _context3.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.extendsPath) === true)) {
                  _context3.next = 2;
                  break;
                }

                return _context3.abrupt("return");

              case 2:
                _context3.next = 4;
                return (0, _loader["default"])(this.extendsPath);

              case 4:
                this.queryExtends = _context3.sent;
                (0, _generator["default"])(this, 'QueryExtends');

              case 6:
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
      var _initTypes = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee4() {
        var types;
        return regeneratorRuntime.wrap(function _callee4$(_context4) {
          while (1) {
            switch (_context4.prev = _context4.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.typesPath) === true)) {
                  _context4.next = 2;
                  break;
                }

                return _context4.abrupt("return");

              case 2:
                _context4.next = 4;
                return (0, _loader["default"])(this.typesPath);

              case 4:
                types = _context4.sent;
                types.map(function (type) {
                  (0, _composer.createType)(type);
                });

              case 6:
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
    key: "configuration",
    value: function () {
      var _configuration = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee5() {
        return regeneratorRuntime.wrap(function _callee5$(_context5) {
          while (1) {
            switch (_context5.prev = _context5.next) {
              case 0:
                if (!(_lodash["default"].isEmpty(this.sequelizeConfig) === true)) {
                  _context5.next = 2;
                  break;
                }

                throw new Error('node sequelize configutration needed');

              case 2:
                _context5.next = 4;
                return this.generateModel();

              case 4:
                _context5.next = 6;
                return this.initHooks();

              case 6:
                _context5.next = 8;
                return this.initTypes();

              case 8:
                this.composeGraphQLObject();
                (0, _generator["default"])(this, 'Query');
                (0, _generator["default"])(this, 'Subscription');
                (0, _generator["default"])(this, 'Mutation');
                (0, _generator["default"])(this, 'Children');
                _context5.next = 15;
                return this.initExtends();

              case 15:
                this.typeDefs = (0, _composer.getTypeDefs)();
                this.resolvers = (0, _composer.getResolvers)();

              case 17:
              case "end":
                return _context5.stop();
            }
          }
        }, _callee5, this);
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