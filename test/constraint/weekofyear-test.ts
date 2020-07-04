import 'mocha';

import { later } from '../../src';
import { LaterDate } from '../../src/date/date';
import { runner } from './runner';
import { fromLocal } from '../../src/date/date';

describe('Later.weekOfYear', function() {

  var tests = [
    {
      // first second of year
      date:  fromLocal(2008, 0, 1),
      val: 1,
      extent: [1,52],
      start: fromLocal(2007, 11, 31),
      end: fromLocal(2008, 0, 6, 23, 59, 59)
    },
    {
      // last second of year
      date: fromLocal(2009, 11, 31, 23, 59, 59),
      val: 53,
      extent: [1,53],
      start: fromLocal(2009, 11, 28),
      end: fromLocal(2010, 0, 3, 23, 59, 59)
    },
    {
      // first second of month starting on Sunday
      date: fromLocal(2010, 7, 1),
      val: 30,
      extent: [1,52],
      start: fromLocal(2010, 6, 26),
      end: fromLocal(2010, 7, 1, 23, 59, 59)
    },
    {
      // last second of month ending on Saturday
      date: fromLocal(2011, 3, 30, 23, 59, 59),
      val: 17,
      extent: [1,52],
      start: fromLocal(2011, 3, 25),
      end: fromLocal(2011, 4, 1, 23, 59, 59)
    },
    {
      // first second of day
      date: fromLocal(2012, 1, 28),
      val: 9,
      extent: [1,52],
      start: fromLocal(2012, 1, 27),
      end: fromLocal(2012, 2, 4, 23, 59, 59)
    },
    {
      // last second of day on leap day
      date: fromLocal(2012, 1, 29, 23, 59, 59),
      val: 9,
      extent: [1,52],
      start: fromLocal(2012, 1, 27),
      end: fromLocal(2012, 2, 4, 23, 59, 59)
    },
    {
      // first second of hour
      date: fromLocal(2012, 10, 8, 14),
      val: 45,
      extent: [1,52],
      start: fromLocal(2012, 10, 5),
      end: fromLocal(2012, 10, 11, 23, 59, 59)
    },
    {
      // last second of hour (start DST)
      date: fromLocal(2013, 2, 10, 1, 59, 59),
      val: 10,
      extent: [1,52],
      start: fromLocal(2013, 2, 4),
      end: fromLocal(2013, 2, 10, 23, 59, 59)
    },
    {
      // first second of hour (end DST)
      date: fromLocal(2013, 10, 3, 2),
      val: 44,
      extent: [1,52],
      start: fromLocal(2013, 9, 28),
      end: fromLocal(2013, 10, 3, 23, 59, 59)
    },
    {
      // last second of hour
      date: fromLocal(2014, 1, 22, 6, 59, 59),
      val: 8,
      extent: [1,52],
      start: fromLocal(2014, 1, 17),
      end: fromLocal(2014, 1, 23, 23, 59, 59)
    },
    {
      // first second of minute
      date: fromLocal(2015, 5, 19, 18, 22),
      val: 25,
      extent: [1,53],
      start: fromLocal(2015, 5, 15),
      end: fromLocal(2015, 5, 21, 23, 59, 59)
    },
    {
      // last second of minute
      date: fromLocal(2016, 7, 29, 2, 56, 59),
      val: 35,
      extent: [1,52],
      start: fromLocal(2016, 7, 29),
      end: fromLocal(2016, 8, 4, 23, 59, 59)
    },
    {
      // second
      date: fromLocal(2017, 8, 4, 10, 31, 22),
      val: 36,
      extent: [1, 52],
      start: fromLocal(2017, 8, 4),
      end: fromLocal(2017, 8, 10, 23, 59, 59)
    }
  ];

  runner(later, later.weekOfYear).run(tests);

});