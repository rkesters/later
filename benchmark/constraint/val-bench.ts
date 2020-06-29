import * as Benchmark from 'benchmark';
import { later } from '../../src/index';
import { LaterDate } from '../../src/date/date';
const suite = new Benchmark.Suite('next');

suite
.add('year', function() {
  later.year.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('month', function() {
  later.month.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('day', function() {
  later.day.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('hour', function() {
  later.hour.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('minute', function() {
  later.minute.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('second', function() {
  later.second.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('dayofweek', function() {
  later.dayOfWeek.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('dayofweekcount', function() {
  later.dayOfWeekCount.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('dayofyear', function() {
  later.dayOfYear.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('time', function() {
  later.time.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('weekofmonth', function() {
  later.weekOfMonth.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.add('weekofyear', function() {
  later.weekOfYear.val(new LaterDate(2012, 4, 15, 20, 15, 13));
})
.on('cycle', function(event: any) {
  console.log(String(event.target));
})
.run({async: true});


