const _ = require('lodash');

class OrderType {
  constructor() {
    this.type = 'enum';
    this.name = 'Order';
    this.values = {
      ASC: { value: 'ASC' },
      DESC: { value: 'DESC' },
    };
  }
}

export default new OrderType();
