import _ from 'lodash';
import GraphQLJSON from 'graphql-type-json';

import UploadType from '../types/UploadType';
import OrderType from '../types/OrderType';
import DateType from '../types/DateType';

const objects = {
  Mutation: {
    name: 'Mutation',
  },
  Query: {
    name: 'Query',
  },
  Subscription: {
    name: 'Subscription',
  },
};
const extendFields = {};
const resolvers = {};

export const createType = (obj) => {
  const { name } = obj;
  objects[name] = obj;
};

export const createInputType = (obj) => {
  const { name } = obj;
  objects[name] = obj;
};

export const createEnumType = (obj) => {
  const { name } = obj;
  objects[name] = obj;
};

export const createScalarType = (name) => {
  objects[name] = {
    type: 'scalar',
    name,
  };
};

export const getTypeDefs = () => {
  let defs = '';
  Object.entries(objects).map(([name, obj]) => {
    const fields = {
      ...obj.fields,
      ...extendFields[name],
    };

    if (obj.description) {
      defs += `"""\n${obj.description.replace(/\n/g, '\n')}\n"""\n`;
    }

    const objType = obj.type || 'type';
    defs += `${objType} ${name}`;

    if (obj.implements) {
      defs += ` implements ${obj.implements}`;
    }

    if (objType === 'scalar') {
      defs += '\n';
      return;
    }

    if (objType === 'enum') {
      defs += ' {\n';
      defs += Object.entries(obj.values)
        .map(([value]) => ` ${value}`)
        .join('\n');
      defs += '\n}\n';
      return;
    }

    defs += ' {\n';
    Object.entries(fields).map(([field, { type, args, description }]) => {
      let fieldArgs = '';

      if (!_.isEmpty(args)) {
        fieldArgs = `(${Object.entries(args || {})
          .map(([k, t]) => `${k}: ${t}`)
          .join(', ')})`;
      }

      if (description) {
        defs += `"""\n${description.replace(/\n/g, '\n')}\n"""\n`;
      }

      defs += ` ${field}${fieldArgs}: ${type}\n`;
    });

    defs += '}\n';
  });

  return defs;
};
export const addFields = (objectName, fields) => {
  _.set(extendFields, objectName, {
    ...extendFields[objectName],
    ...fields,
  });
};

export const addResolver = (path, config) => _.set(resolvers, path, config);

export const getResolvers = () => resolvers;

createEnumType(OrderType);

createScalarType('Date');
addResolver('Date', DateType);
// createScalarType('Upload');
addResolver('Upload', UploadType);
createScalarType('JSON');
addResolver('JSON', GraphQLJSON);
