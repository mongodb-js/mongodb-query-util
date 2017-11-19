const { expect } = require('chai');
const { hasDistinctValue } = require('../');

describe('#hasDistinctValue', () => {
  context('when the field is undefined', () => {
    it('returns false', () => {
      expect(hasDistinctValue()).to.equal(false);
    });
  });

  context('when the field is an $in clause', () => {
    const clause = { $in: [ 1, 2, 3 ]};

    context('when the value is present', () => {
      it('returns true', () => {
        expect(hasDistinctValue(clause, 1)).to.equal(true);
      });
    });

    context('when the value is not present', () => {
      it('returns false', () => {
        expect(hasDistinctValue(clause, 4)).to.equal(false);
      });
    });
  });

  context('when the field has no $in clause', () => {
    it('returns the isequal comparison', () => {
      expect(hasDistinctValue('test', 'test')).to.equal(true);
    });
  });
});
