"use strict";

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _ = require('lodash');

var DataLoader = require('dataloader');

var groupBy = function groupBy(result, ids, groupKey, isOne) {
  var grouped = _.groupBy(result, groupKey);

  var data = ids.map(function (id) {
    return isOne ? _.get(grouped, "".concat(id, ".[0]"), null) : _.get(grouped, "".concat(id), []);
  });
  return data;
};

var query = function query(context, path, callback) {
  var loader = _.get(context, "dataLoader.".concat(path), null);

  if (!loader) {
    loader = new DataLoader(
    /*#__PURE__*/
    function () {
      var _ref = (0, _asyncToGenerator2["default"])(
      /*#__PURE__*/
      _regenerator["default"].mark(function _callee(ids) {
        var result;
        return _regenerator["default"].wrap(function _callee$(_context) {
          while (1) {
            switch (_context.prev = _context.next) {
              case 0:
                _context.next = 2;
                return callback(ids);

              case 2:
                result = _context.sent;
                return _context.abrupt("return", result);

              case 4:
              case "end":
                return _context.stop();
            }
          }
        }, _callee);
      }));

      return function (_x) {
        return _ref.apply(this, arguments);
      };
    }());

    _.set(context, "dataLoader.".concat(path), loader);
  }

  return loader;
};

module.exports = {
  query: query,
  groupBy: groupBy
};