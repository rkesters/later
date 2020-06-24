import 'mocha';

import { expect } from 'chai';

import { later } from '../../src';
import { scheduleFactory } from '../../src/core/schedule';
import { LaterDate } from '../../src/date/date';

describe('Set timeout', function() {

  it('should execute a callback after the specified amount of time', function(done) {
    this.timeout(3000);

    var s = later.parse.recur().every(2).second();

    function test() {
      done();
    }

    later.setTimeout(test, s);
  });

  it('should allow clearing of the timeout', function(done) {
    this.timeout(3000);

    var s = later.parse.recur().every(1).second();

    function test() {
      expect.fail
    }

    var t = later.setTimeout(test, s);
    t.clear();

    setTimeout(done, 2000);
  });


  it('should not execute a far out schedule immediately', function(done) {
    this.timeout(3000);

    var s = later.parse.recur().on(2017).year();

    function test() {
      expect.fail
    }

    var t = later.setTimeout(test, s);

    setTimeout(function() { t.clear(); done(); }, 2000);
  });

  it('should execute a callback for a one-time occurrence after the specified amount of time', function(done) {
    this.timeout(3000);
 
    var offsetInMilliseconds = 2000;
    var now = new LaterDate()
    var nowOffset = now.getTime() + offsetInMilliseconds
    var s = later.parse.recur().on(new LaterDate(nowOffset)).fullDate();

    function test() {
      done();
    }

    later.setTimeout(test, s);
  });

});
