/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
const Resolver = require('./Resolver');

class ListResolver extends Resolver {
  constructor(config) {
    super(config);
  }

  async _resolve(parent, args, context, info) {
    const result = await this.fetchList(args);
    return result;
  }
}

module.exports = ListResolver;
