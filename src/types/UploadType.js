const { GraphQLScalarType } = require('graphql');

class UploadType extends GraphQLScalarType {
  constructor() {
    super({
      name: 'Upload',
      description: 'Upload scalar type',
      parseValue: value => value,
      parseLiteral() {
        throw new Error('‘Upload’ scalar literal unsupported.');
      },
      serialize() {
        throw new Error('‘Upload’ scalar serialization unsupported.');
      },
    });
  }
}

export default new UploadType();
