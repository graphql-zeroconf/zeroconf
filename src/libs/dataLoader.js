const _ = require('lodash');
const DataLoader = require('dataloader');

const groupMapping = (result, ids, groupKey, isOne) => {
  const grouped = _.groupBy(result, groupKey);
  const data = ids.map(id => (isOne ? _.get(grouped[id], '0', null) : grouped[id]));
  return data;
};

const query = (context, path, callback) => {
  let loader = _.get(context, `dataLoader.${path}`, null);
  if (!loader) {
    loader = new DataLoader(async (ids) => {
      const result = await callback(ids);
      return result;
    });

    _.set(context, `dataLoader.${path}`, loader);
  }

  return loader;
};

module.exports = {
  query,
  groupMapping,
};
