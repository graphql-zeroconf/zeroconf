/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
const Resolver = require('./Resolver');

class CreateResolver extends Resolver {
  async _resolve(parent, args, context, info) {
    const {
      convertedName: { typeName, TypeName },
    } = this.model;

    const { input } = args;

    if (this.model.options.createdAt) {
      input[this.model.options.createdAt] = new Date();
    }

    if (this.model.options.updatedAt) {
      input[this.model.options.updatedAt] = new Date();
    }

    const createdRow = await this.model.create(input);

    this.pubSub.publish(TypeName, {
      [typeName]: createdRow,
    });

    return createdRow;
  }
}

module.exports = CreateResolver;
