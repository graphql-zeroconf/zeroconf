"use strict";

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }

function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }

var _ = require('lodash');

var DataLoader = require('dataloader');

var groupMapping = function groupMapping(result, ids, groupKey, isOne) {
  var grouped = _.groupBy(result, groupKey);

  var data = ids.map(function (id) {
    return isOne ? _.get(grouped[id], '0', null) : grouped[id];
  });
  return data;
};

var query = function query(context, path, callback) {
  var loader = _.get(context, "dataLoader.".concat(path), null);

  if (!loader) {
    loader = new DataLoader(
    /*#__PURE__*/
    function () {
      var _ref = _asyncToGenerator(
      /*#__PURE__*/
      regeneratorRuntime.mark(function _callee(ids) {
        var result;
        return regeneratorRuntime.wrap(function _callee$(_context) {
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
  groupMapping: groupMapping
};