const get = require('lodash.get');

const bsonEqual = (value, other) => {
  const bsontype = get(value, '_bsontype', undefined);

  if (bsontype === 'ObjectID') {
    return value.equals(other);
  }
  if (['Decimal128', 'Long'].includes(bsontype)) {
    return value.toString() === other.toString();
  }
  if (['Int32', 'Double'].includes(bsontype)) {
    return value.value === other.value;
  }
  // for all others, use native comparisons
  return undefined;
};

module.exports = bsonEqual;
