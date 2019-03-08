/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
const Resolver = require('./Resolver');

class CountResolver extends Resolver {
  async _resolve(parent, args, context, info) {
    const { sequelize } = this.model;
    const { where } = args;

    const result = await this.model.findOne({
      attributes: [[sequelize.fn('COUNT', sequelize.col('*')), 'nums']],
      where,
    });

    return result.dataValues.nums;
  }
}

module.exports = CountResolver;
