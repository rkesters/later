import 'mocha';
import { expect } from 'chai';
import { LaterDate } from '../../src/date/date';

describe('LaterDate', function () {
    describe('construction', () => {
        describe('when global Tz is UTC', () => {
            before(() => {
                (<any>this).oldTz = LaterDate.useLocalTime;
                LaterDate.timezone(false);
            });
            after(() => {
                LaterDate.timezone((<any>this).oldTz);
            });

            it('given date parts, set to UTC', () => {
                const actual = new LaterDate(2017, 8, 4, 10, 31, 22);
                expect(actual.isUTC).to.be.true;
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 10:31:22 GMT');
            });

            it('given string with UTC, set to UTC', () => {
                const actual = new LaterDate('2017-09-04T10:31:22.000Z');
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 10:31:22 GMT');
                expect(actual.isUTC).to.be.true;
            });

            it('given string with Local TZ, set to UTC', () => {
                const actual = new LaterDate('2017-09-04T10:31:22.000-04:00');
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 14:31:22 GMT');
                expect(actual.isUTC).to.be.true;
            });
            it('given fromLocal, set to UTC', () => {
                const actual = LaterDate.fromLocal(2017, 8, 4, 10, 31, 22);
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 14:31:22 GMT');
                expect(actual.isUTC).to.be.true;
            });

            it('given date parts Local TZ, set to UTC', () => {
                const actual = LaterDate.fromLocal(2017, 8, 4, 10, 31, 22);
                expect(actual.isUTC).to.be.true;
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 14:31:22 GMT');
            });
        });

        describe('when global Tz is LOCAL', () => {
            before(() => {
                (<any>this).oldTz = LaterDate.useLocalTime;
                LaterDate.timezone(true);
            });
            after(() => {
                LaterDate.timezone((<any>this).oldTz);
            });

            it('given date parts, set to LOCAL', () => {
                const actual = new LaterDate(2017, 8, 4, 10, 31, 22);
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 10:31:22 GMT-0400 (Eastern Daylight Time)',
                );
                expect(actual.isUTC).to.be.false;
            });
            it('given fromLocal, set to UTC', () => {
                const actual = LaterDate.fromLocal(2017, 8, 4, 10, 31, 22);
                expect(actual.toString()).to.eql('Mon Sep 04 2017 10:31:22 GMT-0400 (Eastern Daylight Time)');
                expect(actual.isUTC).to.be.false;
            });

            it('given string with UTC, set to LOCAL', () => {
                const actual = new LaterDate('2017-09-04T10:31:22.000Z');
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 06:31:22 GMT-0400 (Eastern Daylight Time)',
                );
                expect(actual.isUTC).to.be.false;
            });

            it('given string with Local TZ, set to LOCAL', () => {
                const actual = new LaterDate('2017-09-04T10:31:22.000-04:00');
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 10:31:22 GMT-0400 (Eastern Daylight Time)',
                );
                expect(actual.isUTC).to.be.false;
            });

            it('given date parts Local TZ, set to LOCAL', () => {
                const actual = LaterDate.fromLocal(2017, 8, 4, 10, 31, 22);
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 10:31:22 GMT-0400 (Eastern Daylight Time)',
                );
                expect(actual.isUTC).to.be.false;
            });
        });
    });
    describe('switch TZ', () => {
        describe('initially UTC', () => {
            beforeEach(() => {
                (<any>this).oldTz = LaterDate.useLocalTime;
                LaterDate.timezone(false);
            });
            afterEach(() => {
                LaterDate.timezone((<any>this).oldTz);
            });

            it('creates as UTC, switch global TZ', () => {
                const actual = new LaterDate(2017, 8, 4, 10, 31, 22);
                expect(actual.isUTC).to.be.true;
                LaterDate.timezone(true);
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 06:31:22 GMT-0400 (Eastern Daylight Time)',
                );
            });

            it('creates as UTC, switch to UTC TZ', () => {
                const test = new LaterDate(2017, 8, 4, 10, 31, 22);
                expect(test.isUTC).to.be.true;
                const actual = test.UTC();
                expect(actual.isUTC).to.be.true;
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 10:31:22 GMT');
            });

            it('creates as UTC, switch to local TZ', () => {
                const test = new LaterDate(2017, 8, 4, 10, 31, 22); // T10:31 UTC
                expect(test.isUTC).to.be.true;
                const actual = test.localTime();
                expect(actual.isUTC).to.be.false;
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 06:31:22 GMT-0400 (Eastern Daylight Time)',
                );
            });

            it('creates as UTC, switch to local TZ then back', () => {
                const test = new LaterDate(2017, 8, 4, 10, 31, 22); // T10:31 UTC
                expect(test.isUTC).to.be.true;
                const test2 = test.localTime();
                const actual = test2.UTC();
                expect(actual.isUTC).to.be.true;
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 10:31:22 GMT');
            });
        });

        describe('initially Local', () => {
            beforeEach(() => {
                (<any>this).oldTz = LaterDate.useLocalTime;
                LaterDate.timezone(true);
            });
            afterEach(() => {
                LaterDate.timezone((<any>this).oldTz);
            });

            it('creates as Local, switch global TZ', () => {
                const actual = new LaterDate(2017, 8, 4, 10, 31, 22);
                expect(actual.isUTC).to.be.false;
                LaterDate.timezone(false);
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 14:31:22 GMT');
            });

            it('creates as Local, switch to UTC TZ', () => {
                const test = new LaterDate(2017, 8, 4, 10, 31, 22);
                expect(test.isUTC).to.be.false;
                const actual = test.UTC();
                expect(actual.isUTC).to.be.true;
                expect(actual.toString()).to.eql('Mon, 04 Sep 2017 14:31:22 GMT');
            });

            it('creates as Local, switch to local TZ', () => {
                const test = new LaterDate(2017, 8, 4, 10, 31, 22); // T10:31 UTC
                expect(test.isUTC).to.be.false;
                const actual = test.localTime();
                expect(actual.isUTC).to.be.false;
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 10:31:22 GMT-0400 (Eastern Daylight Time)',
                );
            });

            it('creates as Local, switch to UTC TZ then back', () => {
                const test = new LaterDate(2017, 8, 4, 10, 31, 22); // T10:31 UTC
                expect(test.isUTC).to.be.false;
                const test2 = test.UTC();
                const actual = test2.localTime();
                expect(actual.isUTC).to.be.false;
                expect(actual.toString()).to.eql(
                    'Mon Sep 04 2017 10:31:22 GMT-0400 (Eastern Daylight Time)',
                );
            });
        });
    });
});
