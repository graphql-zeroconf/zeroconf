/* eslint-disable no-debugger */
import _ from 'lodash';
import path from 'path';

import Sequelize from 'sequelize';
import { PubSub } from 'graphql-subscriptions';

import acl from '../libs/acl';
import loader from '../libs/loader';
import generator from '../libs/generator';
import { addResolver, createScalarType } from '../libs/composer';
import isEnumType from '../libs/isEnumType';
import UploadType from '../types/UploadType';

import {
  createType,
  createInputType,
  createEnumType,
  getTypeDefs,
  getResolvers,
} from '../libs/composer';

import ModelToObjectType from './convert/ModelToObjectType';
import ModelToWhereInputType from './convert/ModelToWhereInputType';
import ModelToCreationInputType from './convert/ModelToCreationInputType';
import ModelToUpdateInputType from './convert/ModelToUpdateInputType';
import ModelToOrderInputType from './convert/ModelToOrderInputType';

import ModelNameToTypeName from './convert/ModelNameToTypeName';
import FieldToEnumType from './convert/FieldToEnumType';

const models = require(path.resolve('models'));

const { Op } = Sequelize;

const operatorsAliases = {
  eq: Op.eq,
  ne: Op.ne,
  gte: Op.gte,
  gt: Op.gt,
  lte: Op.lte,
  lt: Op.lt,
  not: Op.not,
  in: Op.in,
  notIn: Op.notIn,
  is: Op.is,
  like: Op.like,
  notLike: Op.notLike,
  iLike: Op.iLike,
  notILike: Op.notILike,
  regexp: Op.regexp,
  notRegexp: Op.notRegexp,
  iRegexp: Op.iRegexp,
  notIRegexp: Op.notIRegexp,
  between: Op.between,
  notBetween: Op.notBetween,
  overlap: Op.overlap,
  contains: Op.contains,
  contained: Op.contained,
  adjacent: Op.adjacent,
  strictLeft: Op.strictLeft,
  strictRight: Op.strictRight,
  noExtendRight: Op.noExtendRight,
  noExtendLeft: Op.noExtendLeft,
  and: Op.and,
  or: Op.or,
  any: Op.any,
  all: Op.all,
  values: Op.values,
  col: Op.col,
};

class ZeroConf {
  constructor(config) {
    this.hooks = {};
    this.models = {};
    this.graphiql = true;

    if (config.context) {
      this.setContext(config.context);
      delete config.context;
    }

    if (config.allows) {
      acl.allow(config.allows);
      this.acl = acl;
    }

    for (const key of Object.keys(config)) {
      this[key] = config[key];
    }

    this.pubSub = new PubSub();

    if (config.withApollo !== true) {
      createScalarType('Upload');
      addResolver('Upload', UploadType);
    }
  }

  composeEnumType(model) {
    const {
      rawAttributes,
      convertedName: { TypeName },
    } = model;

    _.each(rawAttributes, (attr, key) => {
      const dataType = attr.type.constructor.name;
      if (dataType !== 'ENUM') {
        return;
      }

      if (!isEnumType(attr)) {
        return;
      }

      createEnumType(new FieldToEnumType(TypeName, attr));
    });
  }

  composeGraphQLObject() {
    Object.values(this.models).forEach((model) => {
      this.composeEnumType(model);

      createType(new ModelToObjectType(model));
      createInputType(new ModelToCreationInputType(model));
      createInputType(new ModelToUpdateInputType(model));
      createInputType(new ModelToWhereInputType(model));
      createInputType(new ModelToOrderInputType(model));
    });
  }

  async generateModel() {
    const {
      database, user, password, option,
    } = this.sequelizeConfig;
    this.sequelize = new Sequelize(database, user, password, {
      operatorsAliases,
      ...option,
    });

    Object.entries(models).forEach(([modelName, definition]) => {
      const model = this.sequelize.import(modelName, definition);
      model.convertedName = new ModelNameToTypeName(modelName);
      this.models[modelName] = model;
    });
  }

  setContext(func) {
    this.context = args => func.apply(this, [args, this.models, this.acl]);
  }

  async initHooks() {
    if (_.isEmpty(this.hooksPath) === true) {
      return;
    }

    const hookDefs = await loader(this.hooksPath);
    for (const {
      type, name, when, hook,
    } of hookDefs) {
      _.set(this.hooks, `${type}.${name}.${when}`, hook);
    }
  }

  async initExtends() {
    if (_.isEmpty(this.extendsPath) === true) {
      return;
    }

    this.queryExtends = await loader(this.extendsPath);
    generator(this, 'QueryExtends');
  }

  async initTypes() {
    if (_.isEmpty(this.typesPath) === true) {
      return;
    }

    const types = await loader(this.typesPath);
    types.map((type) => {
      createType(type);
    });
  }

  async configuration() {
    if (_.isEmpty(this.sequelizeConfig) === true) {
      throw new Error('node sequelize configutration needed');
    }

    await this.generateModel();
    await this.initHooks();
    await this.initTypes();

    this.composeGraphQLObject();

    generator(this, 'Query');
    generator(this, 'Subscription');
    generator(this, 'Mutation');
    generator(this, 'Children');

    await this.initExtends();

    this.typeDefs = getTypeDefs();
    this.resolvers = getResolvers();
  }
}

module.exports = ZeroConf;
