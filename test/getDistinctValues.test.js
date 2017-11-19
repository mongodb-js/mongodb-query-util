const { expect } = require('chai');
const { getDistinctValues } = require('../');

describe('#getDistinctValues', () => {
  context('when the field is undefined', () => {
    it('returns an empty array', () => {
      expect(getDistinctValues()).to.deep.equal([]);
    });
  });

  context('when the field is an $in clause', () => {
    it('returns the $in clause', () => {
      expect(getDistinctValues({ $in: [ 1, 2, 3 ]})).to.deep.equal([ 1, 2, 3 ]);
    });
  });

  context('when the field is not an object', () => {
    it('returns the field in an array', () => {
      expect(getDistinctValues('test')).to.deep.equal([ 'test' ]);
    });
  });
});
