"use strict";

var CountResolver = require('./CountResolver');

var CreateResolver = require('./CreateResolver');

var DeleteResolver = require('./DeleteResolver');

var ListResolver = require('./ListResolver');

var RowResolver = require('./RowResolver');

var UpdateResolver = require('./UpdateResolver');

module.exports = {
  CountResolver: CountResolver,
  CreateResolver: CreateResolver,
  DeleteResolver: DeleteResolver,
  ListResolver: ListResolver,
  RowResolver: RowResolver,
  UpdateResolver: UpdateResolver
};