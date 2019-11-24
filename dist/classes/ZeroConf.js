"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _slicedToArray2 = _interopRequireDefault(require("@babel/runtime/helpers/slicedToArray"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

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
    this.config = config;

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
    value: function generateModel() {
      var _this2 = this;

      var _this$sequelizeConfig = this.sequelizeConfig,
          database = _this$sequelizeConfig.database,
          user = _this$sequelizeConfig.user,
          password = _this$sequelizeConfig.password,
          option = _this$sequelizeConfig.option,
          dialectOptions = _this$sequelizeConfig.dialectOptions;
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
    }
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
    value: function initHooks() {
      if (_lodash["default"].isEmpty(this.hooksPath) === true) {
        return;
      }

      var hookDefs = null;

      if (typeof this.hooksPath === "string") {
        hookDefs = (0, _loader["default"])(this.hooksPath);
      } else {
        hookDefs = this.hooksPath;
      }

      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = hookDefs[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var _step$value = _step.value,
              type = _step$value.type,
              name = _step$value.name,
              when = _step$value.when,
              hook = _step$value.hook;

          _lodash["default"].set(this.hooks, "".concat(type, ".").concat(name, ".").concat(when), hook);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
  }, {
    key: "initExtends",
    value: function initExtends() {
      if (_lodash["default"].isEmpty(this.extendsPath) === true) {
        return;
      }

      var queryExtends = null;

      if (typeof this.extendsPath === "string") {
        queryExtends = (0, _loader["default"])(this.extendsPath);
      } else {
        queryExtends = this.extendsPath;
      }

      this.queryExtends = [].concat((0, _toConsumableArray2["default"])(this.queryExtends), (0, _toConsumableArray2["default"])(queryExtends));
    }
  }, {
    key: "initTypes",
    value: function initTypes() {
      if (_lodash["default"].isEmpty(this.typesPath) === true) {
        return;
      }

      var types = null;

      if (typeof this.typesPath === "string") {
        types = (0, _loader["default"])(this.typesPath);
      } else {
        types = this.typesPath;
      }

      types.map(function (type) {
        (0, _composer.createType)(type);
      });
    }
  }, {
    key: "use",
    value: function use(module) {
      var _this4 = this;

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
    }
  }, {
    key: "configuration",
    value: function configuration() {
      if (_lodash["default"].isEmpty(this.sequelizeConfig) === true) {
        throw new Error("node sequelize configutration needed");
      }

      this.generateModel();
      this.initHooks();
      this.composeGraphQLObject();
      (0, _generator["default"])(this, "Query");
      (0, _generator["default"])(this, "Subscription");
      (0, _generator["default"])(this, "Mutation");
      (0, _generator["default"])(this, "Children");
      this.initTypes();
      this.initExtends();
      (0, _generator["default"])(this, "QueryExtends");
      this.typeDefs = (0, _composer.getTypeDefs)();
      this.resolvers = (0, _composer.getResolvers)();
    }
  }]);
  return ZeroConf;
}();

var _default = ZeroConf;
exports["default"] = _default;