"use strict";

var _ = require('lodash');

var path = require('path');

var read = require('fs-readdir-recursive');

module.exports = function (dirPath) {
  var defines = read(dirPath);
  var tmp = [];
  var _iteratorNormalCompletion = true;
  var _didIteratorError = false;
  var _iteratorError = undefined;

  try {
    for (var _iterator = defines[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
      var file = _step.value;
      var dirName = path.dirname("".concat(file), '.js');
      var baseName = path.basename("".concat(file), '.js');
      var requirePath = "".concat(dirPath, "/").concat(dirName, "/").concat(baseName);

      var define = require(requirePath);

      tmp.push(define);
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

  return tmp;
};