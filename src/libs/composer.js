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
    const { type, values } = obj;

    const fields = {
      ...obj.fields,
      ...extendFields[name],
    };

    const objType = type || 'type';
    defs += `${objType} ${name}`;

    if (objType === 'scalar') {
      defs += '\n';
      return;
    }

    if (objType === 'enum') {
      defs += ' {\n';
      defs += Object.entries(values)
        .map(([value]) => ` ${value}`)
        .join('\n');
      defs += '\n}\n';
      return;
    }

    defs += ' {\n';
    Object.entries(fields).map(([field, { type, args }]) => {
      let fieldArgs = '';

      if (!_.isEmpty(args)) {
        fieldArgs = `(${Object.entries(args || {})
          .map(([k, t]) => `${k}: ${t}`)
          .join(', ')})`;
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
