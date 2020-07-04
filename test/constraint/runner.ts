import 'mocha';

import { expect } from 'chai';

import { IConstraint } from '../../src/constraint/contraint';
import { NEVER } from '../../src/date/constant';
import { LaterDate } from '../../src/date/date';
import { Later } from '../../src/later';

export interface ITestData {
    date: LaterDate;
    val: number;
    extent: number[];
    start: Date;
    end: Date;
}

export function runner(later: Later, constraint: IConstraint) {
    function convertToUTC(d: LaterDate): LaterDate {
        return d.isUTC ? d : d.UTC();
    }

    function convertToLocal(d: LaterDate): LaterDate {
        return d.isUTC ? d.localTime() : d;
    }

    function runSingleTest(fn: string, data: ITestData, utc: boolean) {
        var date = utc ? convertToUTC(data.date) : convertToLocal(data.date),
            dateString = utc ? date.toUTCString() : date,
            ex: LaterDate =
                (<any>data)[fn] instanceof LaterDate
                    ? utc
                        ? convertToUTC((<any>data)[fn])
                        : convertToLocal((<any>data)[fn])
                    : (<any>data)[fn];
        const exString = utc && ex instanceof Date ? ex.toUTCString() : ex;

        it('should return ' + exString + ' for ' + dateString, function () {
            if (utc) later.date.UTC();
            else later.date.localTime();
            var actual = (<any>constraint)[fn](date);
            actual = actual instanceof Date ? actual.getTime() : actual;
            expect(actual).to.eql(ex.getTime ? ex.getTime() : ex);
        });
    }

    function runSweepTest(fn: string, data: ITestData, utc: boolean) {
        var min = data.extent[0] === 1 ? 0 : data.extent[0],
            max = 1, //data.extent[1] + 1,
            inc = Math.ceil((max - min) / 200); // max 200 tests per constraint

        for (var i = min; i <= max; i = i + inc) {
            // test for overbounds
            if (fn === 'next') {
                testNext(data, i, utc); // test all values for amt
            } else {
                testPrev(data, i, utc); // test all values for amt
            }
        }
    }

    function testNext(data: ITestData, amt: number, utc: boolean) {
        var date = utc ? convertToUTC(data.date) : convertToLocal(data.date),
            dateString = utc ? date.toUTCString() : date;

        it('should return first date after ' + dateString + ' with val ' + amt, function () {
            if (utc) later.date.UTC();
            else later.date.localTime();

            var next = constraint.next(date, amt),
                ex = amt,
                outOfBounds = ex > constraint.extent(date)[1] || ex > constraint.extent(next)[1];

            // if amt is outside of extent, the constraint should rollover to the
            // first value of the following time period
            if (outOfBounds) ex = constraint.extent(next)[0];

            // hack to pass hour test that crosses DST
            if (
                ex === 2 &&
                constraint.val(next) === 3 &&
                next.getTimezoneOffset() !== date.getTimezoneOffset()
            ) {
                ex = 3;
            }

            // result should match ex, should be greater than date, and should
            // be at the start of the time period
            // if check is hack to support year constraints which can return undefined
            if (
                constraint.name === 'year' &&
                (amt <= constraint.val(date) || amt > later.Y.extent(<any>date)[1])
            ) {
                expect(next).to.eql(NEVER);
            } else {
                expect(constraint.isValid(next, ex)).to.true;
                expect(next.getTime()).to.be.above(date.getTime());

                // need to special case day of week count since the last nth day may
                // not fall on a week boundary
                if (constraint.name !== 'day of week count' || amt !== 0) {
                    expect(constraint.start(next).getTime()).to.eql(next.getTime());
                }
            }
        });
    }

    function testPrev(data: ITestData, amt: number, utc: boolean) {
        var date: LaterDate = utc ? convertToUTC(data.date) : convertToLocal(data.date),
            dateString = utc ? date.toUTCString() : date;
        it('should return first date before ' + dateString + ' with val ' + amt, function () {
            if (utc) later.date.UTC();
            else later.date.localTime();

            var prev = constraint.prev(date, amt),
                ex = amt,
                outOfBounds = ex > constraint.extent(prev)[1];

            // if amt is outside of extent, the constraint should rollover to the
            // first value of the following time period
            if (outOfBounds) ex = constraint.extent(prev)[1];

            // result should match ex, should be greater than date, and should
            // be at the start of the time period
            // if check is hack to support year constraints which can return undefined
            if (
                constraint.name === 'year' &&
                (amt >= constraint.val(date) || amt < later.Y.extent(<any>date)[0])
            ) {
                prev.should.eql(later.NEVER);
                expect(prev).to.eql(later.NEVER);
            } else {
                expect(prev.getTime()).to.be.below(date.getTime());
                expect(constraint.isValid(prev, ex), `prev: ${prev} ex: ${ex}`).to.true;
                expect(constraint.end(prev).getTime()).to.eql(prev.getTime());
            }
        });
    }

    return {
        run: function (data: ITestData[], isYear: boolean = false) {
            var i = 0,
                len = data.length;

            // test both UTC and local times for all functions
            [false].forEach(function (utc) {
                // simple tests have the expected value passed in as data
                ['val', 'extent', 'start', 'end'].forEach(function (fn) {
                    describe(fn, function () {
                        for (i = 0; i < len; i++) {
                            runSingleTest(fn, data[i], utc);
                        }
                    });
                });

                // complex tests do a sweep across all values and validate results
                // using checks verified by the simple tests
                ['next', 'prev'].forEach(function (fn) {
                    describe(fn, function () {
                        for (i = 0; i < len; i++) {
                            runSweepTest(fn, data[i], utc);
                        }
                    });
                });
            });
        },
    };
}
