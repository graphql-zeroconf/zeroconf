/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
const Resolver = require('./Resolver');

class DeleteResolver extends Resolver {
  async _resolve(parent, args, context, info) {
    const { where } = args;

    const result = await this.model.destroy({ where });
    return result;
  }
}

module.exports = DeleteResolver;
