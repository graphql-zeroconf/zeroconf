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
        return value.getTime(); // value sent to the client
      },
      parseLiteral(ast) {
        if (ast.kind === Kind.INT) {
          return new Date(ast.value); // ast value is always in string format
        }
        return null;
      },
    });
  }
}

export default new DateType();
