/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
const Resolver = require('./Resolver');

class UpdateResolver extends Resolver {
  async _resolve(parent, args, context, info) {
    const {
      convertedName: { typeName, TypeName },
    } = this.model;

    const { input, where } = args;

    if (_.isEmpty(where) === true) {
      throw new Error("Invalid where syntax");
    }

    if (this.model.options.updatedAt) {
      input[this.model.options.updatedAt] = new Date();
    }

    await this.model.update(input, {
      where,
    });

    const updatedRow = await this.fetchRow(args);

    this.pubSub.publish(TypeName, {
      [typeName]: updatedRow,
    });

    return updatedRow;
  }
}

module.exports = UpdateResolver;
