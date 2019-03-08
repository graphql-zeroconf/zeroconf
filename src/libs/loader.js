const _ = require('lodash');
const path = require('path');
const read = require('fs-readdir-recursive');

module.exports = (dirPath) => {
  const defines = read(dirPath);
  const tmp = [];

  for (const file of defines) {
    const dirName = path.dirname(`${file}`, '.js');
    const baseName = path.basename(`${file}`, '.js');
    const requirePath = `${dirPath}/${dirName}/${baseName}`;

    const define = require(requirePath);
    tmp.push(define);
  }

  return tmp;
};
