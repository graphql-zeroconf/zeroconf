import Resolver from '../resolvers/Resolver';

class ListSubscriber extends Resolver {
  async _resolve(parent, args, context, info) {
    const result = await this.fetchList(args);
    return result;
  }

  _subscribe() {
    const {
      convertedName: { TypeName },
    } = this.model;
    return this.pubSub.asyncIterator(TypeName);
  }
}

export default ListSubscriber;
