const { GraphQLScalarType } = require('graphql');
const { Kind } = require('graphql/language');

class DateType extends GraphQLScalarType {
  constructor() {
    super({
      name: 'Date',
      description: 'Date custom scalar type',
      parseValue(value) {
        return new Date(value); // value from the client
      },
      serialize(value) {
        if (value instanceof Date) {
          return value.getTime();
        }
        if (typeof value === 'number') {
          return Math.trunc(value);
        }
        if (typeof value === 'string') {
          return Date.parse(value);
        }
        return null;
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value); // ast value is always in string format
        }
        if (ast.kind === Kind.STRING) {
          return new Date(ast.value);
        }
        return null;
      },
    });
  }
}

export default new DateType();
