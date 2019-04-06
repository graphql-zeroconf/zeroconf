/* eslint-disable no-debugger */
/* eslint-disable no-loop-func */
import _ from 'lodash';
import Sequelize from 'sequelize';

import {
  RowResolver,
  ListResolver,
  CountResolver,
  CreateResolver,
  UpdateResolver,
  DeleteResolver,
} from '../classes/resolvers';

import { RowSubscriber, ListSubscriber } from '../classes/subscribers';
import { addFields, addResolver } from './composer';
import dataLoader from './dataLoader';

const { Op } = Sequelize;

const getListQueryFields = (zeroConf, type, fieldName, model) => {
  const { hooks, pubSub } = zeroConf;
  const {
    convertedName: { TypeName },
  } = model;
  const path = `${type}.${fieldName}`;

  const config = {
    path,
    model,
    hooks,
    pubSub,
  };
  const Resolver = type === 'Query' ? new ListResolver(config) : new ListSubscriber(config);

  addResolver(path, {
    resolve: Resolver.resolve,
    subscribe: Resolver.subscribe,
  });

  return {
    type: `[${TypeName}]`,
    args: {
      start: 'Int',
      limit: 'Int',
      order: `${TypeName}OrderInput`,
      where: 'JSON',
    },
  };
};

const getRowQueryFields = (zeroConf, type, fieldName, model) => {
  const { hooks, pubSub } = zeroConf;
  const {
    convertedName: { TypeName },
  } = model;
  const path = `${type}.${fieldName}`;

  const config = {
    path,
    model,
    hooks,
    pubSub,
  };

  const Resolver = type === 'Query' ? new RowResolver(config) : new RowSubscriber(config);

  addResolver(path, {
    resolve: Resolver.resolve,
    subscribe: Resolver.subscribe,
  });

  return {
    type: `${TypeName}`,
    args: {
      where: `${TypeName}WhereInput!`,
    },
  };
};

const getCountQueryFields = (zeroConf, type, TypeNames, model) => {
  const { hooks, pubSub } = zeroConf;
  const path = `${type}.num${TypeNames}`;

  addResolver(path, {
    resolve: new CountResolver({
      path,
      model,
      hooks,
      pubSub,
    }).resolve,
  });

  return {
    type: 'Int!',
    args: {
      where: 'JSON',
    },
  };
};

const getMutationFields = (zeroConf) => {
  const fields = {};
  const { hooks, pubSub, models } = zeroConf;

  for (const model of Object.values(models)) {
    const {
      convertedName: { TypeName },
    } = model;

    addResolver(`Mutation.create${TypeName}`, {
      resolve: new CreateResolver({
        path: `Mutation.create${TypeName}`,
        model,
        hooks,
        pubSub,
      }).resolve,
    });

    fields[`create${TypeName}`] = {
      type: TypeName,
      args: {
        input: `${TypeName}CreationInput!`,
      },
    };

    addResolver(`Mutation.update${TypeName}`, {
      resolve: new UpdateResolver({
        path: `Mutation.update${TypeName}`,
        model,
        hooks,
        pubSub,
      }).resolve,
    });

    fields[`update${TypeName}`] = {
      type: TypeName,
      args: {
        where: `${TypeName}WhereInput!`,
        input: `${TypeName}UpdateInput!`,
      },
    };

    addResolver(`Mutation.delete${TypeName}`, {
      resolve: new DeleteResolver({
        path: `Mutation.delete${TypeName}`,
        model,
        hooks,
        pubSub,
      }).resolve,
    });

    fields[`delete${TypeName}`] = {
      type: 'Int',
      args: {
        where: `${TypeName}WhereInput!`,
      },
    };
  }

  return fields;
};

const generateMutation = (zeroConf) => {
  const fields = {
    ...getMutationFields(zeroConf),
  };

  addFields('Mutation', fields);
};

const generateChildren = (zeroConf) => {
  const { models } = zeroConf;

  for (const model of Object.values(models)) {
    const sourceModel = model;
    const { tableAttributes } = sourceModel;

    const filtered = _.filter(tableAttributes, attr => attr.references);

    _.each(filtered, (attr) => {
      const {
        field: sourceKey,
        references: { key: targetKey, model: targetModelName },
      } = attr;
      const targetModel = models[targetModelName];

      const childPath = `${sourceModel.convertedName.TypeName}.${
        targetModel.convertedName.typeName
      }`;
      addResolver(childPath, {
        resolve: async (parent, args, context, info) => {
          const loader = dataLoader.query(context, childPath, async (ids) => {
            targetModel.hasOne(sourceModel, { foreignKey: sourceKey, targetKey });

            const result = await targetModel.findAll({
              where: {
                [targetKey]: {
                  [Op.in]: ids,
                },
              },
            });

            return dataLoader.groupMapping(result, ids, targetKey, true);
          });

          return loader.load(parent[sourceKey]);
        },
      });

      const childrenPath = `${sourceModel.convertedName.TypeName}.${
        targetModel.convertedName.typeNames
      }`;
      addResolver(childrenPath, {
        resolve: async (parent, args, context, info) => {
          const loader = dataLoader.query(context, childrenPath, async (ids) => {
            targetModel.hasMany(sourceModel, { foreignKey: sourceKey, targetKey });
            const result = await targetModel.findAll({
              where: {
                [targetKey]: {
                  [Op.in]: ids,
                },
              },
            });

            return dataLoader.groupMapping(result, ids, targetKey, false);
          });

          return loader.load(parent[sourceKey]);
        },
      });

      addFields(sourceModel.convertedName.TypeName, {
        [targetModel.convertedName.typeName]: {
          type: targetModel.convertedName.TypeName,
        },
        [targetModel.convertedName.typeNames]: {
          type: `[${targetModel.convertedName.TypeName}]`,
        },
      });
    });
  }
};

const generateQuery = (zeroConf, type) => {
  const fields = {};
  const { models } = zeroConf;

  for (const model of Object.values(models)) {
    const {
      convertedName: { typeName, typeNames, TypeNames },
    } = model;

    fields[typeName] = getRowQueryFields(zeroConf, type, typeName, model);
    fields[typeNames] = getListQueryFields(zeroConf, type, typeNames, model);
    fields[`num${TypeNames}`] = getCountQueryFields(zeroConf, type, TypeNames, model);
  }
  addFields(type, fields);
};

const generateQueryExtends = (zeroConf) => {
  const { hooks, queryExtends } = zeroConf;
  for (const {
    type, field, returnType, args, resolver,
  } of queryExtends) {
    const path = `${type}.${field}`;

    addResolver(path, {
      resolve: async (parent, resolverArgs, context, info) => {
        const beforeHook = _.get(hooks, `${path}.before`, null);
        const afterHook = _.get(hooks, `${path}.after`, null);

        const newArgs = beforeHook
          ? await beforeHook(parent, resolverArgs, context, info)
          : resolverArgs;

        const result = await resolver(parent, newArgs, context, info);

        if (afterHook) {
          await afterHook(parent, newArgs, context, info);
        }

        return result;
      },
    });

    addFields(type, {
      [field]: {
        args,
        type: returnType,
      },
    });
  }
};

const generator = (zeroConf, type = 'Query') => {
  if (type === 'Mutation') {
    generateMutation(zeroConf);
  }

  if (type === 'Query') {
    generateQuery(zeroConf, 'Query');
  }

  if (type === 'Subscription') {
    generateQuery(zeroConf, 'Subscription');
  }

  if (type === 'Children') {
    generateChildren(zeroConf);
  }

  if (type === 'QueryExtends') {
    generateQueryExtends(zeroConf);
  }
};

export default generator;
