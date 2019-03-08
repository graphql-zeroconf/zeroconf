/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
const Resolver = require('./Resolver');

class RowResolver extends Resolver {
  async _resolve(parent, args, context, info) {
    const result = await this.fetchRow(args);
    return result;
  }
}

module.exports = RowResolver;
