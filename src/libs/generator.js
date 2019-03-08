/* eslint-disable no-debugger */
/* eslint-disable no-loop-func */
import _ from 'lodash';
import DataLoader from 'dataloader';
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
    type: TypeName,
    args: {
      where: `${TypeName}WhereInput`,
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
    type: 'Int',
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
        input: `${TypeName}CreationInput`,
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
        where: `${TypeName}WhereInput`,
        input: `${TypeName}UpdateInput`,
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
        where: `${TypeName}WhereInput`,
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

      const dataLoader = new DataLoader(async (ids) => {
        const result = await targetModel.findAll({
          where: {
            [targetKey]: {
              [Op.in]: ids,
            },
          },
        });

        const zipped = _.zipObject(ids, _.times(ids.length, _.constant([])));
        const grouped = _.groupBy(result, targetKey);
        const data = Object.values({
          ...zipped,
          ...grouped,
        });

        return data;
      });

      addResolver(`${sourceModel.convertedName.TypeName}.${targetModel.convertedName.typeName}`, {
        resolve: (parent, args, context, info) => dataLoader.load(parent[sourceKey]),
      });

      addResolver(`${sourceModel.convertedName.TypeName}.${targetModel.convertedName.typeNames}`, {
        resolve: (parent, args, context, info) => dataLoader.load(parent[sourceKey]),
      });

      addFields(sourceModel.convertedName.TypeName, {
        [targetModel.convertedName.typeName]: {
          type: targetModel.convertedName.TypeName,
        },
        [targetModel.convertedName.typeNames]: {
          type: [targetModel.convertedName.TypeName],
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

        await resolver(parent, newArgs, context, info);

        if (afterHook) {
          await afterHook(parent, newArgs, context, info);
        }
      },
    });

    addFields(type, {
      [field]: {
        ...(args || null),
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
