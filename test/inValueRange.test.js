const { inValueRange } = require('../');
const bson = require('bson');
const { expect } = require('chai');

describe('inValueRange [Util]', () => {
  let query;

  afterEach(() => {
    query = null;
  });

  describe('equality queries', () => {
    beforeEach(() => {
      query = 15;
    });

    it('should detect a match', () => {
      expect(inValueRange(query, {value: 15, dx: 0})).to.equal('yes');
    });

    it('should detect a partial match', () => {
      expect(inValueRange(query, {value: 14, dx: 2})).to.equal('partial');
    });

    it('should detect a miss', () => {
      expect(inValueRange(query, {value: 14.99, dx: 0})).to.equal('no');
      expect(inValueRange(query, {value: 15.01, dx: 0})).to.equal('no');
    });
  });

  describe('closed ranges with $gte and $lt', () => {
    beforeEach(() => {
      query = { $gte: 15, $lt: 30 };
    });

    it('should detect a match', () => {
      expect(inValueRange(query, {value: 20, dx: 5})).to.equal('yes');
    });

    it('should detect a match at the lower bound', () => {
      expect(inValueRange(query, {value: 15, dx: 5})).to.equal('yes');
    });

    it('should detect a partial match across the upper bound', () => {
      expect(inValueRange(query, {value: 20, dx: 20})).to.equal('partial');
    });

    it('should detect a partial match across the lower bound', () => {
      expect(inValueRange(query, {value: 10, dx: 10})).to.equal('partial');
    });

    it('should detect a miss exactly at the lower bound', () => {
      expect(inValueRange(query, {value: 10, dx: 5})).to.equal('no');
    });

    it('should detect a miss exactly at the upper bound', () => {
      expect(inValueRange(query, {value: 30, dx: 5})).to.equal('no');
    });

    it('should detect a miss just below the lower bound', () => {
      expect(inValueRange(query, {value: 10, dx: 4.99})).to.equal('no');
    });

    it('should detect edge case where range wraps around both bounds', () => {
      expect(inValueRange(query, {value: 0, dx: 100})).to.equal('partial');
    });
  });

  describe('closed ranges for negative values with $gte and $lt', () => {
    beforeEach(() => {
      query = { $gte: -30, $lt: -15 };
    });

    it('should detect a match', () => {
      expect(inValueRange(query, {value: -20, dx: 5})).to.equal('yes');
    });

    it('should detect a match at the lower bound', () => {
      expect(inValueRange(query, {value: -30, dx: 5})).to.equal('yes');
    });

    it('should detect a partial match across the upper bound', () => {
      expect(inValueRange(query, {value: -20, dx: 20})).to.equal('partial');
    });

    it('should detect a partial match across the lower bound', () => {
      expect(inValueRange(query, {value: -35, dx: 10})).to.equal('partial');
    });

    it('should detect a miss exactly at the lower bound', () => {
      expect(inValueRange(query, {value: -35, dx: 5})).to.equal('no');
    });

    it('should detect a miss exactly at the upper bound', () => {
      expect(inValueRange(query, {value: -15, dx: 5})).to.equal('no');
    });

    it('should detect a miss just below the lower bound', () => {
      expect(inValueRange(query, {value: -35, dx: 4.99})).to.equal('no');
    });

    it('should detect edge case where range wraps around both bounds', () => {
      expect(inValueRange(query, {value: -100, dx: 100})).to.equal('partial');
    });
  });

  describe('open ranges with $gte', () => {
    beforeEach(() => {
      query = {$gte: 15};
    });

    it('should detect a match for a range', () => {
      expect(inValueRange(query, {value: 20, dx: 5})).to.equal('yes');
    });

    it('should detect a match for single value', () => {
      expect(inValueRange(query, {value: 20, dx: 0})).to.equal('yes');
    });

    it('should detect a match for a range, starting at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 5})).to.equal('yes');
    });

    it('should detect a miss for a range, ending at the bound', () => {
      expect(inValueRange(query, {value: 10, dx: 5})).to.equal('no');
    });

    it('should detect a match for single value at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 0})).to.equal('yes');
    });

    it('should detect a partial match for a range across the bound', () => {
      expect(inValueRange(query, {value: 12, dx: 5})).to.equal('partial');
    });

    it('should detect a miss for a range below the bound', () => {
      expect(inValueRange(query, {value: -20, dx: 5})).to.equal('no');
    });

    it('should detect a miss for a single value below the bound', () => {
      expect(inValueRange(query, {value: -20, dx: 0})).to.equal('no');
    });
  });

  describe('open ranges with $gt', () => {
    beforeEach(() => {
      query = {$gt: 15};
    });

    it('should detect a match for a range', () => {
      expect(inValueRange(query, {value: 20, dx: 5})).to.equal('yes');
    });

    it('should detect a match for single value', () => {
      expect(inValueRange(query, {value: 20, dx: 0})).to.equal('yes');
    });

    it('should detect a partial match for a range, starting at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 5})).to.equal('partial');
    });

    it('should detect a miss for single value at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 0})).to.equal('no');
    });

    it('should detect a partial match for a range across the bound', () => {
      expect(inValueRange(query, {value: 12, dx: 5})).to.equal('partial');
    });

    it('should detect a miss for a range ending at the bound', () => {
      expect(inValueRange(query, {value: 10, dx: 5})).to.equal('no');
    });

    it('should detect a miss for a range below the bound', () => {
      expect(inValueRange(query, {value: -20, dx: 5})).to.equal('no');
    });

    it('should detect a miss for a single value below the bound', () => {
      expect(inValueRange(query, {value: -20, dx: 0})).to.equal('no');
    });
  });

  describe('open ranges with $lte', () => {
    beforeEach(() => {
      query = {$lte: 15};
    });

    it('should detect a match for a range', () => {
      expect(inValueRange(query, {value: 5, dx: 5})).to.equal('yes');
    });

    it('should detect a match for single value', () => {
      expect(inValueRange(query, {value: 10, dx: 0})).to.equal('yes');
    });

    it('should detect a match for single value at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 0})).to.equal('yes');
    });

    it('should detect a partial match for a range across the bound', () => {
      expect(inValueRange(query, {value: 12, dx: 5})).to.equal('partial');
    });

    it('should detect a match for a range ending at the bound', () => {
      expect(inValueRange(query, {value: 10, dx: 5})).to.equal('yes');
    });

    it('should detect a partial match for a range starting at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 5})).to.equal('partial');
    });

    it('should detect a miss for a range above the bound', () => {
      expect(inValueRange(query, {value: 20, dx: 5})).to.equal('no');
    });

    it('should detect a miss for a single value above the bound', () => {
      expect(inValueRange(query, {value: 20, dx: 0})).to.equal('no');
    });
  });

  describe('open ranges with $lt', () => {
    beforeEach(() => {
      query = {$lt: 15};
    });

    it('should detect a match for a range', () => {
      expect(inValueRange(query, {value: 5, dx: 5})).to.equal('yes');
    });

    it('should detect a match for single value', () => {
      expect(inValueRange(query, {value: 10, dx: 0})).to.equal('yes');
    });

    it('should detect a miss for a range starting at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 5})).to.equal('no');
    });

    it('should detect a miss for single value at the bound', () => {
      expect(inValueRange(query, {value: 15, dx: 0})).to.equal('no');
    });

    it('should detect a partial match for a range across the bound', () => {
      expect(inValueRange(query, {value: 12, dx: 5})).to.equal('partial');
    });

    it('should detect a match for a range ending at the bound', () => {
      expect(inValueRange(query, {value: 10, dx: 5})).to.equal('yes');
    });

    it('should detect a miss for a range above the bound', () => {
      expect(inValueRange(query, {value: 20, dx: 5})).to.equal('no');
    });

    it('should detect a miss for a single value above the bound', () => {
      expect(inValueRange(query, {value: 20, dx: 0})).to.equal('no');
    });
  });

  describe('ranges with $exists', () => {
    beforeEach(() => {
      query = {$exists: true};
    });

    it('should detect a match for a range', () => {
      expect(inValueRange(query, {value: 5, dx: 5})).to.equal('yes');
    });

    it('should detect a match for single value', () => {
      expect(inValueRange(query, {value: 10, dx: 0})).to.equal('yes');
    });
  });

  describe('ranges with $eq', () => {
    beforeEach(() => {
      query = {$eq: 5};
    });

    it('should detect a match for a range', () => {
      expect(inValueRange(query, {value: 5, dx: 5})).to.equal('partial');
    });

    it('should detect a match for single value', () => {
      expect(inValueRange(query, {value: 10, dx: 0})).to.equal('no');
    });
  });

  describe('non-numeric types', () => {
    it('should work for dates', () => {
      query = {$gte: new Date('2011-01-01'), $lte: new Date('2013-01-01')};

      expect(inValueRange(query, {value: new Date('2012-01-01')})).to.equal('yes');
      expect(inValueRange(query, {value: new Date('2015-01-01')})).to.equal('no');
    });

    it('should work for objectids', () => {
      query = {
        $gte: new bson.ObjectId('578cfb38d5021e616087f53f'),
        $lte: new bson.ObjectId('578cfb42d5021e616087f541')
      };

      expect(inValueRange(query, {value: new bson.ObjectId('578cfb3ad5021e616087f540')})).to.equal('yes');
      expect(inValueRange(query, {value: new bson.ObjectId('578cfb6fd5021e616087f542')})).to.equal('no');
    });

    it('should work for $numberDecimal', () => {
      query = {
        $gte: bson.Decimal128.fromString('1.5'),
        $lte: bson.Decimal128.fromString('2.5')
      };

      expect(inValueRange(query, {value: bson.Decimal128.fromString('1.8')})).to.equal('yes');
      expect(inValueRange(query, {value: bson.Decimal128.fromString('4.4')})).to.equal('no');
    });

    it('should work for $numberDecimal with a dx of 0', () => {
      query = {
        $gte: bson.Decimal128.fromString('1.5'),
        $lte: bson.Decimal128.fromString('2.5')
      };

      expect(inValueRange(query, {value: bson.Decimal128.fromString('1.8'), dx: 0})).to.equal('yes');
      expect(inValueRange(query, {value: bson.Decimal128.fromString('4.4'), dx: 0})).to.equal('no');
    });

    it('should work for $numberDecimal with a single equality query', () => {
      query = bson.Decimal128.fromString('1.5');

      expect(inValueRange(query, {value: bson.Decimal128.fromString('1.5')})).to.equal('yes');
      expect(inValueRange(query, {value: bson.Decimal128.fromString('1.6')})).to.equal('no');
    });

    it('should work for $numberDecimal with a single equality query and dx of 0', () => {
      query = bson.Decimal128.fromString('1.5');

      expect(inValueRange(query, {value: bson.Decimal128.fromString('1.5'), dx: 0})).to.equal('yes');
      expect(inValueRange(query, {value: bson.Decimal128.fromString('1.6'), dx: 0})).to.equal('no');
    });
  });

  describe('special edge cases', () => {
    it('should detect a miss exactly at the lower bound for very large numbers', () => {
      query = {$gte: 10000000000, $lt: 10100000000};

      expect(inValueRange(query, {value: 9900000000, dx: 100000000})).to.equal('no');
    });
  });
});
