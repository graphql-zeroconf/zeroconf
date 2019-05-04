import _ from "lodash";
import GraphQLJSON from "graphql-type-json";
import GraphQLBigInt from "graphql-bigint";

import OrderType from "../types/OrderType";
import DateType from "../types/DateType";

const objects = {
  Mutation: {
    name: "Mutation"
  },
  Query: {
    name: "Query"
  },
  Subscription: {
    name: "Subscription"
  }
};
const extendFields = {};
const resolvers = {};

export const createType = obj => {
  const { name } = obj;
  objects[name] = obj;
};

export const createInputType = obj => {
  const { name } = obj;
  objects[name] = obj;
};

export const createEnumType = obj => {
  const { name } = obj;
  objects[name] = obj;
};

export const createScalarType = name => {
  objects[name] = {
    type: "scalar",
    name
  };
};

export const getTypeDefs = () => {
  let defs = "";
  Object.entries(objects).map(([name, obj]) => {
    const fields = {
      ...obj.fields,
      ...extendFields[name]
    };

    if (obj.description) {
      console.log(obj.description);
      defs += `"""\n${obj.description.replace(/\n/g, "\n")}\n"""\n`;
    }

    const objType = obj.type || "type";
    defs += `${objType} ${name}`;

    if (obj.implements) {
      defs += ` implements ${obj.implements}`;
    }

    if (objType === "scalar") {
      defs += "\n";
      return;
    }

    if (objType === "enum") {
      defs += " {\n";
      defs += Object.entries(obj.values)
        .map(([value]) => ` ${value}`)
        .join("\n");
      defs += "\n}\n";
      return;
    }

    defs += " {\n";
    Object.entries(fields).map(([field, { type, args, description }]) => {
      let fieldArgs = "";

      if (!_.isEmpty(args)) {
        const tmp = [];
        Object.entries(args || {}).forEach(([k, t]) => {
          if (typeof t === "string") {
            tmp.push(`\t\t${k}: ${t}`);
          }

          if (typeof t === "object") {
            if (t.description) {
              tmp.push('\t\t"""');
              tmp.push(`\t\t${t.description}`);
              tmp.push('\t\t"""');
            }

            tmp.push(`\t\t${k}: ${t.type}`);
          }
        });

        fieldArgs = `(\n${tmp.join("\n ")}\n\t)`;
      }

      if (description && typeof description === "string") {
        defs += `"""\n${description.replace(/\n/g, "\n")}\n"""\n`;
      }

      defs += `\t${field}${fieldArgs}: ${type}\n`;
    });

    defs += "}\n";
  });

  return defs;
};
export const addFields = (objectName, fields) => {
  _.set(extendFields, objectName, {
    ...extendFields[objectName],
    ...fields
  });
};

export const addResolver = (path, config) => _.set(resolvers, path, config);

export const getResolvers = () => resolvers;

createEnumType(OrderType);

createScalarType("Date");
addResolver("Date", DateType);
createScalarType("JSON");
addResolver("JSON", GraphQLJSON);
createScalarType("BigInt");
addResolver("BigInt", GraphQLBigInt);
