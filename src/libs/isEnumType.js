/* eslint-disable no-debugger */
import _ from 'lodash';

// https://facebook.github.io/graphql/June2018/#sec-Names
// For the reason of naming convension in graphql, zeroconf always allow with alphabet or underscore
const isEnumType = (attr) => {
  let enumType = true;
  _.each(attr.type.values, (value) => {
    const index = value.search(/^[_A-Za-z][_0-9A-Za-z]*/);
    if (index === -1) {
      enumType = false;
      return enumType;
    }
  });

  return enumType;
};

export default isEnumType;
