/* eslint-disable no-return-await */
/* eslint-disable no-debugger */
/* eslint-disable no-restricted-syntax */
import _ from 'lodash';
const { PubSub } = require('graphql-subscriptions');

class Resolver {
  constructor(config) {
    this.path = config.path;
    this.model = config.model;
    this.pubSub = config.pubSub;

    this.beforeHook = null;
    this.afterHook = null;

    if (config.hooks) {
      this.beforeHook = _.get(config.hooks, `${this.path}.before`, null);
      this.afterHook = _.get(config.hooks, `${this.path}.after`, null);
    }
  }

  resolve = async (parent, resolverArgs, context, info) => {
    let args = resolverArgs;
    if (this.beforeHook) {
      args = this.beforeHook ? await this.beforeHook(parent, resolverArgs, context, info) : args;
    }

    const result = await this._resolve(parent, args, context, info);

    if (this.afterHook) {
      await this.afterHook(parent, args, context, info);
    }

    return result;
  };

  subscribe = () => {
    return this._subscribe();
  };

  async _resolve(parent, args, context, info) {
    return null;
  }

  _subscribe() {
    return null;
  }

  async fetchRow(args) {
    const { where } = args;
    console.log(where);
    const result = await this.model.findOne({
      where,
    });
    return result;
  }

  async fetchList(args) {
    const { where, start: offset, limit, order } = args;

    const result = await this.model.findAll({
      where,
      offset,
      limit,
      order: _.toPairs(order),
    });

    return result;
  }
}

module.exports = Resolver;
