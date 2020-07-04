import * as Benchmark from 'benchmark';
import { later } from '../../src/index';
import { LaterDate } from '../../src/date/date';
const suite = new Benchmark.Suite('next');

suite
    .add('year', function () {
        later.year.next(new LaterDate(2012, 4, 15, 20, 15, 13), 2014);
    })
    .add('month', function () {
        later.month.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('day', function () {
        later.day.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('hour', function () {
        later.hour.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('minute', function () {
        later.minute.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('second', function () {
        later.second.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('dayofweek', function () {
        later.dayOfWeek.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('dayofweekcount', function () {
        later.dayOfWeekCount.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('dayofyear', function () {
        later.dayOfYear.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('time', function () {
        later.time.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('weekofmonth', function () {
        later.weekOfMonth.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .add('weekofyear', function () {
        later.weekOfYear.next(new LaterDate(2012, 4, 15, 20, 15, 13), 1);
    })
    .on('cycle', function (event: any) {
        console.log(String(event.target));
    })
    .run({ async: false });
