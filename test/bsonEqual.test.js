const { expect } = require('chai');
const { bsonEqual } = require('../');
const { ObjectId, Decimal128, Long, Int32, Double } = require('bson');

describe('#bsonEqual', () => {
  context('when the value is an object id', () => {
    context('when the values are equal', () => {
      const id = new ObjectId();

      it('returns true', () => {
        expect(bsonEqual(id, id)).to.equal(true);
      });
    });

    context('when the values are not equal', () => {
      const id = new ObjectId();
      const other = new ObjectId();

      it('returns false', () => {
        expect(bsonEqual(id, other)).to.equal(false);
      });
    });
  });

  context('when the value is a decimal 128', () => {
    context('when the values are equal', () => {
      const first = new Decimal128('12.45');
      const second = new Decimal128('12.45');

      it('returns true', () => {
        expect(bsonEqual(first, second)).to.equal(true);
      });
    });

    context('when the values are not equal', () => {
      const first = new Decimal128('12.45');
      const second = new Decimal128('112.123');

      it('returns false', () => {
        expect(bsonEqual(first, second)).to.equal(false);
      });
    });
  });

  context('when the value is a long', () => {
    context('when the values are equal', () => {
      const first = new Long(12);
      const second = new Long(12);

      it('returns true', () => {
        expect(bsonEqual(first, second)).to.equal(true);
      });
    });

    context('when the values are not equal', () => {
      const first = new Long(12);
      const second = new Long(15);

      it('returns false', () => {
        expect(bsonEqual(first, second)).to.equal(false);
      });
    });
  });

  context('when the value is an int32', () => {
    context('when the values are equal', () => {
      const first = new Int32(12);
      const second = new Int32(12);

      it('returns true', () => {
        expect(bsonEqual(first, second)).to.equal(true);
      });
    });

    context('when the values are not equal', () => {
      const first = new Int32(12);
      const second = new Int32(15);

      it('returns false', () => {
        expect(bsonEqual(first, second)).to.equal(false);
      });
    });
  });

  context('when the value is a double', () => {
    context('when the values are equal', () => {
      const first = new Double(12.2);
      const second = new Double(12.2);

      it('returns true', () => {
        expect(bsonEqual(first, second)).to.equal(true);
      });
    });

    context('when the values are not equal', () => {
      const first = new Double(12.2);
      const second = new Double(15.2);

      it('returns false', () => {
        expect(bsonEqual(first, second)).to.equal(false);
      });
    });
  });

  context('when the value is a string', () => {
    it('returns undefined', () => {
      expect(bsonEqual('', '')).to.equal(undefined);
    });
  });
});
