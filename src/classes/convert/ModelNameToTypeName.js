import pluralize from 'pluralize';
import camelCase from 'camelcase';

class ModelNameToTypeName {
  constructor(name) {
    this.modelName = pluralize.singular(name);
    this.modelNames = pluralize.plural(name);
    this.TypeNames = camelCase(this.modelNames, { pascalCase: true });
    this.typeNames = camelCase(this.modelNames, { pascalCase: false });
    this.TypeName = camelCase(this.modelName, { pascalCase: true });
    this.typeName = camelCase(this.modelName, { pascalCase: false });
  }
}

export default ModelNameToTypeName;
