/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
const Resolver = require("./Resolver");
const _ = require("lodash");

class DeleteResolver extends Resolver {
  async _resolve(parent, args, context, info) {
    const { where } = args;

    if (_.isEmpty(where) === true) {
      throw new Error("Invalid where syntax");
    }

    const result = await this.model.destroy({ where });
    return result;
  }
}

module.exports = DeleteResolver;
