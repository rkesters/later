import 'mocha';

import { expect } from 'chai';

import { later } from '../../src';
import { scheduleFactory } from '../../src/core/schedule';
import { LaterDate } from '../../src/date/date';

describe('Set interval', function() {

  it('should execute a callback after the specified amount of time', function(done) {
    this.timeout(0);

    var s = later.parse.recur().every(1).second(),
        t = later.setInterval(test, s),
        count = 0;

    function test() {
      expect(later.schedule(s).isValid(new LaterDate())).to.be.true
      count++;
      if(count > 2) {
        t.clear();
        done();
      }
    }

  });

  it('should allow clearing of the timeout', function(done) {
    this.timeout(0);

    var s = later.parse.recur().every(2).second();

    function test() {
      expect.fail();
    }

    var t = later.setInterval(test, s);
    t.clear();

    setTimeout(done, 3000);
  });

});