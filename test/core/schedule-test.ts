import 'mocha';

import { expect } from 'chai';

import { later } from '../../src';
import { scheduleFactory } from '../../src/core/schedule';
import { LaterDate } from '../../src/date/date';

describe('Schedule', function () {
    later.date.UTC();
    const schedule = scheduleFactory(later);

    describe('isValid', function () {
        var d = new LaterDate('2013-03-21T00:00:05Z');

        it('should return true if date is valid', function () {
            var s = { schedules: [{ Y: [2013], M: [3], D: [21], s: [5] }], exceptions: [] };
            expect(schedule(s).isValid(d)).to.eql(true);
        });

        it('should return false if date is invalid', function () {
            var s = { schedules: [{ Y: [2012] }], exceptions: [] };
            expect(schedule(s).isValid(d)).to.eql(false);  
        });
    });

    describe('next', function () {
        var d = new LaterDate('2013-03-21T00:00:05Z'),
            e = new LaterDate('2016-01-01T00:00:05Z');

        it('should return the start date if it is valid', function () {
            var s = { schedules: [{ Y: [2013], M: [3], D: [21], s: [5] }], exceptions: [] };
            expect(schedule(s).next(1, d)).to.eql(d);
        });

        it('should return next valid date if one exists', function () {
            var s = { schedules: [{ Y: [2015] }], exceptions: [] };
            expect(schedule(s).next(1, d)).to.eql(new LaterDate('2015-01-01T00:00:00Z'));
        });

        it('should return next valid date if one exists with composite', function () {
            var s = { schedules: [{ Y: [2017] }, { Y: [2015] }], exceptions: [] };
            expect(schedule(s).next(1, d)).to.eql(new LaterDate('2015-01-01T00:00:00Z'));
        });

        it('should return next valid date if one exists with exceptions', function () {
            var s = { schedules: [{ Y: [2015, 2016, 2017] }], exceptions: [{ Y: [2015] }] };
            expect(schedule(s).next(1, d)).to.eql(new LaterDate('2016-01-01T00:00:00Z'));
        });

        it('should return count valid dates if they exist', function () {
            var s = { schedules: [{ Y: [2015, 2016, 2017] }], exceptions: [] };
            expect(schedule(s).next(3, d)).to.eql([
                new LaterDate('2015-01-01T00:00:00Z'),
                new LaterDate('2016-01-01T00:00:00Z'),
                new LaterDate('2017-01-01T00:00:00Z'),
            ]);
        });

        it('should return later.NEVER if no next valid date exists', function () {
            var s = { schedules: [{ Y: [2012] }], exceptions: [] };
            expect((<Date>schedule(s).next(1, d))).to.equal(later.NEVER);
        });

        it('should return later.NEVER if end date precludes a valid schedule', function () {
            var s = { schedules: [{ Y: [2017] }], exceptions: [] };
            expect(schedule(s).next(1, d, e)).to.equal(later.NEVER);
        });
    });

    describe('prev', function () {
        var d = new LaterDate('2013-03-21T00:00:05Z'),
            e = new LaterDate('2010-01-01T00:00:05Z');

        it('should return the start date if it is valid', function () {
            var s = { schedules: [{ Y: [2013], M: [3], D: [21], s: [5] }], exceptions: [] };
            expect(schedule(s).prev(1, d)).to.eql(d);
        });

        it('should return prev valid date if one exists', function () {
            var s = { schedules: [{ Y: [2012] }], exceptions: [] };
            expect(schedule(s).prev(1, d)).to.eql(new LaterDate('2012-01-01T00:00:00Z'));
        });

        it('should return prev valid date if one exists with exceptions', function () {
            var s = { schedules: [{ Y: [2012, 2013, 2014] }], exceptions: [{ Y: [2013] }] };
            expect(schedule(s).prev(1, d)).to.eql(new LaterDate('2012-01-01T00:00:00Z'));
        });

        it('should return count valid dates if they exist', function () {
            var s = { schedules: [{ Y: [2010, 2011, 2012] }], exceptions: [] };
            expect(schedule(s).prev(3, d)).to.eql([
                new LaterDate('2012-01-01T00:00:00Z'),
                new LaterDate('2011-01-01T00:00:00Z'),
                new LaterDate('2010-01-01T00:00:00Z'),
            ]);
        });

        it('should return later.NEVER if no prev valid date exists', function () {
            var s = { schedules: [{ Y: [2017] }], exceptions: [] };
            expect((<Date>schedule(s).prev(1, d))?.getTime()).equal(later.NEVER.getTime());
        });

        it('should return later.NEVER if end date precludes a valid schedule', function () {
            var s = { schedules: [{ Y: [2009] }], exceptions: [] };
            expect(schedule(s).prev(1, d, e)).equal(later.NEVER);
        });
    });

    describe('nextRange', function () {
        it('should return next valid range if one exists', function () {
            var d = new LaterDate('2013-03-21T00:00:05Z'),
                e = new LaterDate('2016-01-01T00:00:05Z');

            var s = { schedules: [{ Y: [2015, 2016, 2017] }], exceptions: [] };

            expect(schedule(s).nextRange(1, d)).to.eql([
                new LaterDate('2015-01-01T00:00:00Z'),
                new LaterDate('2018-01-01T00:00:00Z'),
            ]);
        });

        it('should correctly calculate ranges', function () {
            var d = new LaterDate('2013-03-21T00:00:05Z');

            var s = {
                schedules: [{ dw: [2, 3, 4, 5, 6], h_a: [8], h_b: [16] }],
                exceptions: [
                    { fd_a: [1362420000000], fd_b: [1362434400000] },
                    { fd_a: [1363852800000], fd_b: [1363860000000] },
                    { fd_a: [1364499200000], fd_b: [1364516000000] },
                ],
            };

            expect(schedule(s).nextRange(1, d)).to.eql([
                new LaterDate('2013-03-21T10:00:00Z'),
                new LaterDate('2013-03-21T16:00:00Z'),
            ]);
        });

        it('should return undefined as end if there is no end date', function () {
            var d = new LaterDate('2013-03-21T00:00:05Z');

            var s = {
                schedules: [{ fd_a: [1363824005000] }],
            };

            expect(schedule(s).nextRange(3, d)).to.eql([
                [new LaterDate('2013-03-21T00:00:05Z'), undefined],
            ]);
        });

        // issue #27
        it('should merge valid ranges across anded schedule definitions', function () {
            var d = new LaterDate('2013-09-28T11:00:00+06:00');

            var s = later.parse.recur().every().hour().between(0, 8).onWeekday().and().onWeekend();

            expect(schedule(s).nextRange(2, d)).to.eql([
                [new LaterDate('2013-09-28T05:00:00Z'), new LaterDate('2013-09-30T09:00:00Z')],
                [new LaterDate('2013-10-01T00:00:00Z'), new LaterDate('2013-10-01T09:00:00Z')],
            ]);
        });
    });

    describe('prevRange', function () {
        var d = new LaterDate('2013-03-21T00:00:05Z'),
            e = new LaterDate('2016-01-01T00:00:05Z');

        it('should return next valid range if one exists', function () {
            var s = { schedules: [{ Y: [2011, 2012] }], exceptions: [] };
            expect(schedule(s).prevRange(1, d)).to.eql([
                new LaterDate('2011-01-01T00:00:00Z'),
                new LaterDate('2013-01-01T00:00:00Z'),
            ]);
        });

        it('should return undefined as end if there is no end date', function () {
            var d = new LaterDate('2013-03-21T00:00:05Z');

            var s = {
                schedules: [{ fd_b: [1363824005000] }],
            };

            expect(schedule(s).prevRange(3, d)).to.eql([
                [undefined, new LaterDate('2013-03-21T00:00:05Z')],
            ]);
        });

        // issue #27
        it('should merge valid ranges across anded schedule definitions', function () {
            var d = new LaterDate('2013-09-30T09:00:00Z');

            var s = later.parse.recur().every().hour().between(0, 8).onWeekday().and().onWeekend();

            expect(schedule(s).prevRange(2, d)).to.eql([
                [new LaterDate('2013-09-28T00:00:00Z'), new LaterDate('2013-09-30T09:00:00Z')],
                [new LaterDate('2013-09-27T00:00:00Z'), new LaterDate('2013-09-27T09:00:00Z')],
            ]);
        });
    });
});
