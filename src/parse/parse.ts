import * as _ from 'lodash';
import { IConstraint } from '../constraint/contraint';
import { IScheduleDef } from '../core/compile';
import { ISchedule } from '../core/schedule';
import { LaterDate } from '../date/date';
import { Base } from '../later-base';

export const TOKENTYPESGlobal = {
    eof: /^$/,
    rank: /^((\d+)(st|nd|rd|th)?)\b/,
    time: /^((([0]?[1-9]|1[0-2]):[0-5]\d(\s)?(am|pm))|(([0]?\d|1\d|2[0-3]):[0-5]\d))\b/,
    dayName: /^((sun|mon|tue(s)?|wed(nes)?|thu(r(s)?)?|fri|sat(ur)?)(day)?)\b/,
    monthName: /^(jan(uary)?|feb(ruary)?|ma((r(ch)?)?|y)|apr(il)?|ju(ly|ne)|aug(ust)?|oct(ober)?|(sept|nov|dec)(ember)?)\b/,
    yearIndex: /^(\d\d\d\d)\b/,
    every: /^every\b/,
    after: /^after\b/,
    before: /^before\b/,
    second: /^(s|sec(ond)?(s)?)\b/,
    minute: /^(m|min(ute)?(s)?)\b/,
    hour: /^(h|hour(s)?)\b/,
    day: /^(day(s)?( of the month)?)\b/,
    dayInstance: /^day instance\b/,
    dayOfWeek: /^day(s)? of the week\b/,
    dayOfYear: /^day(s)? of the year\b/,
    weekOfYear: /^week(s)?( of the year)?\b/,
    weekOfMonth: /^week(s)? of the month\b/,
    weekday: /^weekday\b/,
    weekend: /^weekend\b/,
    month: /^month(s)?\b/,
    year: /^year(s)?\b/,
    between: /^between (the)?\b/,
    start: /^(start(ing)? (at|on( the)?)?)\b/,
    at: /^(at|@)\b/,
    and: /^(,|and\b)/,
    except: /^(except\b)/,
    also: /(also)\b/,
    first: /^(first)\b/,
    last: /^last\b/,
    in: /^in\b/,
    of: /^of\b/,
    onthe: /^on the\b/,
    on: /^on\b/,
    through: /(-|^(to|through)\b)/,
};

export type ITOKENTYPES = RegExp;

export interface IParseText {
    startPos: number;
    endPos: number;
    text: string;
    type: ITOKENTYPES | undefined;
}
export interface IRecur {
    /**
     * Set of constraints that must be met for an occurrence to be valid.
     *
     * @api public
     */
    schedules: LaterDate[];
    /**
     * Set of exceptions that must not be met for an occurrence to be
     * valid.
     *
     * @api public
     */
    exceptions: LaterDate[];
    /**
     * Specifies the specific instances of a time period that are valid.
     * Must be followed by the desired time period (minute(), hour(),
     * etc). For example, to specify a schedule for the 5th and 25th
     * minute of every hour:
     *
     * recur().on(5, 25).minute();
     *
     * @param {Int} args: One or more valid instances
     * @api public
     */
    on: (...args: (string | number | LaterDate)[]) => any;
    /**
     * Specifies the recurring interval of a time period that are valid.
     * Must be followed by the desired time period (minute(), hour(),
     * etc). For example, to specify a schedule for every 4 hours in the
     * day:
     *
     * recur().every(4).hour();
     *
     * @param {Int} x: Recurring interval
     * @api public
     */
    every: (x?: string | number) => any;
    /**
     * Specifies the minimum valid value.  For example, to specify a schedule
     * that is valid for all hours after four:
     *
     * recur().after(4).hour();
     *
     * @param {Int} x: Recurring interval
     * @api public
     */
    after: (x: string | number) => any;
    /**
     * Specifies the maximum valid value.  For example, to specify a schedule
     * that is valid for all hours before four:
     *
     * recur().before(4).hour();
     *
     * @param {Int} x: Recurring interval
     * @api public
     */
    before: (x: string| number) => any;
    /**
     * Specifies that the first instance of a time period is valid. Must
     * be followed by the desired time period (minute(), hour(), etc).
     * For example, to specify a schedule for the first day of every
     * month:
     *
     * recur().first().dayOfMonth();
     *
     * @api public
     */
    first: () => any;
    /**
     * Specifies that the last instance of a time period is valid. Must
     * be followed by the desired time period (minute(), hour(), etc).
     * For example, to specify a schedule for the last day of every year:
     *
     * recur().last().dayOfYear();
     *
     * @api public
     */
    last: () => any;
    /**
     * Specifies a specific time that is valid. Time must be specified in
     * hh:mm:ss format using 24 hour time. For example, to specify
     * a schedule for 8:30 pm every day:
     *
     * recur().time('20:30:00');
     *
     * @param {String} time: Time in hh:mm:ss 24-hour format
     * @api public
     */
    time: () => any;
    /**
     * Seconds time period, denotes seconds within each minute.
     * Minimum value is 0, maximum value is 59. Specify 59 for last.
     *
     * recur().on(5, 15, 25).second();
     *
     * @api public
     */
    second: () => any;
    /**
     * Minutes time period, denotes minutes within each hour.
     * Minimum value is 0, maximum value is 59. Specify 59 for last.
     *
     * recur().on(5, 15, 25).minute();
     *
     * @api public
     */
    minute: () => any;
    /**
     * Hours time period, denotes hours within each day.
     * Minimum value is 0, maximum value is 23. Specify 23 for last.
     *
     * recur().on(5, 15, 25).hour();
     *
     * @api public
     */
    hour: () => any;
    /**
     * Days of month time period, denotes number of days within a month.
     * Minimum value is 1, maximum value is 31.  Specify 0 for last.
     *
     * recur().every(2).dayOfMonth();
     *
     * @api public
     */
    dayOfMonth: () => any;
    /**
     * Days of week time period, denotes the days within a week.
     * Minimum value is 1, maximum value is 7.  Specify 0 for last.
     * 1 - Sunday
     * 2 - Monday
     * 3 - Tuesday
     * 4 - Wednesday
     * 5 - Thursday
     * 6 - Friday
     * 7 - Saturday
     *
     * recur().on(1).dayOfWeek();
     *
     * @api public
     */
    dayOfWeek: () => any;
    /**
     * Short hand for on(1,7).dayOfWeek()
     *
     * @api public
     */
    onWeekend: () => any;
    /**
     * Short hand for on(2,3,4,5,6).dayOfWeek()
     *
     * @api public
     */
    onWeekday: () => any;
    /**
     * Days of week count time period, denotes the number of times a
     * particular day has occurred within a month.  Used to specify
     * things like second Tuesday, or third Friday in a month.
     * Minimum value is 1, maximum value is 5.  Specify 0 for last.
     * 1 - First occurrence
     * 2 - Second occurrence
     * 3 - Third occurrence
     * 4 - Fourth occurrence
     * 5 - Fifth occurrence
     * 0 - Last occurrence
     *
     * recur().on(1).dayOfWeek().on(1).dayOfWeekCount();
     *
     * @api public
     */
    dayOfWeekCount: () => any;
    /**
     * Days of year time period, denotes number of days within a year.
     * Minimum value is 1, maximum value is 366.  Specify 0 for last.
     *
     * recur().every(2).dayOfYear();
     *
     * @api public
     */
    dayOfYear: () => any;
    /**
     * Weeks of month time period, denotes number of weeks within a
     * month. The first week is the week that includes the 1st of the
     * month. Subsequent weeks start on Sunday.
     * Minimum value is 1, maximum value is 5.  Specify 0 for last.
     * February 2nd,  2012 - Week 1
     * February 5th,  2012 - Week 2
     * February 12th, 2012 - Week 3
     * February 19th, 2012 - Week 4
     * February 26th, 2012 - Week 5 (or 0)
     *
     * recur().on(2).weekOfMonth();
     *
     * @api public
     */
    weekOfMonth: () => any;
    /**
     * Weeks of year time period, denotes the ISO 8601 week date. For
     * more information see: http://en.wikipedia.org/wiki/ISO_week_date.
     * Minimum value is 1, maximum value is 53.  Specify 0 for last.
     *
     * recur().every(2).weekOfYear();
     *
     * @api public
     */
    weekOfYear: () => any;
    /**
     * Month time period, denotes the months within a year.
     * Minimum value is 1, maximum value is 12.  Specify 0 for last.
     * 1 - January
     * 2 - February
     * 3 - March
     * 4 - April
     * 5 - May
     * 6 - June
     * 7 - July
     * 8 - August
     * 9 - September
     * 10 - October
     * 11 - November
     * 12 - December
     *
     * recur().on(1).dayOfWeek();
     *
     * @api public
     */
    month: () => any;
    /**
     * Year time period, denotes the four digit year.
     * Minimum value is 1970, maximum value is Jan 1, 2100 (arbitrary)
     *
     * recur().on(2011, 2012, 2013).year();
     *
     * @api public
     */
    year: () => any;
    /**
     * Full date period, denotes a full date and time.
     * Minimum value is Jan 1, 1970, maximum value is Jan 1, 2100 (arbitrary)
     *
     * recur().on(new Date(2013, 3, 2, 10, 30, 0)).fullDate();
     *
     * @api public
     */
    fullDate: () => any;
    /**
     * Custom modifier.
     *
     * recur().on(2011, 2012, 2013).custom('partOfDay');
     *
     * @api public
     */
    customModifier: (id: string, ...vals: number[]) => any;
    /**
     * Custom time period.
     *
     * recur().on(2011, 2012, 2013).customPeriod('partOfDay');
     *
     * @api public
     */
    customPeriod: (id: keyof Base) => any;
    /**
     * Modifies a recurring interval (specified using every) to start
     * at a given offset.  To create a schedule for every 5 minutes
     * starting on the 6th minute - making minutes 6, 11, 16, etc valid:
     *
     * recur().every(5).minute().startingOn(6);
     *
     * @param {Int} start: The desired starting offset
     * @api public
     */
    startingOn: (start: number) => any;
    /**
     * Modifies a recurring interval (specified using every) to start
     * and stop at specified times.  To create a schedule for every
     * 5 minutes starting on the 6th minute and ending on the 11th
     * minute - making minutes 6 and 11 valid:
     *
     * recur().every(5).minute().between(6, 11);
     *
     * @param {Int} start: The desired starting offset
     * @param {Int} end: The last valid value
     * @api public
     */
    between: (start: number, end: number) => any;
    /**
     * Creates a composite schedule.  With a composite schedule, a valid
     * occurrence of any of the component schedules is considered a valid
     * value for the composite schedule (e.g. they are OR'ed together).
     * To create a schedule for every 5 minutes on Mondays and every 10
     * minutes on Tuesdays:
     *
     * recur().every(5).minutes().on(1).dayOfWeek().and().every(10)
     *    .minutes().on(2).dayOfWeek();
     *
     * @api public
     */
    and: () => any;
    /**
     * Creates exceptions to a schedule. Any valid occurrence of the
     * exception schedule (which may also be composite schedules) is
     * considered a invalid schedule occurrence. Everything that follows
     * except will be treated as an exception schedule.  To create a
     * schedule for 8:00 am every Tuesday except for patch Tuesday
     * (second Tuesday each month):
     *
     * recur().at('08:00:00').on(2).dayOfWeek().except()
     *    .dayOfWeekCount(1);
     *
     * @api public
     */
    except: () => any;
}
export interface IParse {
    recur(): IRecur;
    cron(expr: string, hasSeconds: boolean): ISchedule;
    text(
        str: string,
    ): {
        schedules: any;
        exceptions: any;
        error: number;
    };
}

function convertToInteger(d: number | string): number | string {
    if (_.isNumber(d)) return d;

    if (['#', '/', '-', 'L', 'W', '%', ':'].some((k) => d.includes(k))) return d;

    const c = parseInt(d, 10);
    if (isNaN(c)) return d;

    return c;
}
export function parseFactory(later: Base): IParse {
    return {
        recur() {
            let schedules: LaterDate[] = [],
                exceptions: LaterDate[] = [],
                cur: LaterDate | null,
                curArr: LaterDate[] = schedules,
                curName: string,
                values: any[],
                every: number,
                modifier: string | number,
                applyMin: number,
                applyMax: number,
                i,
                last: { m: number; n: string; c: number; x: number };

            /**
             * Adds values to the specified constraint in the current schedule.
             *
             * @param {String} name: Name of constraint to add
             * @param {Int} min: Minimum value for this constraint
             * @param {Int} max: Maximum value for this constraint
             */
            function add(name: string, min?: number, max?: number) {
                name = modifier ? name + '_' + modifier : name;

                if (!cur) {
                    curArr.push({} as LaterDate);
                    cur = curArr[0];
                }

                if (!(<any>cur)[name]) {
                    (<any>cur)[name] = [];
                }

                curName = (<any>cur)[name];
                if (every && !_.isNil(min) && !_.isNil(max)) {
                    values = [];
                    for (i = min; i <= max; i += every) {
                        values.push(i);
                    }

                    // save off values in case of startingOn or between
                    last = { n: name, x: every, c: curName.length, m: max };
                }

                values = applyMin && !_.isNil(min) ? [min] : applyMax && !_.isNil(max) ? [max] : values;
                const length = values.length;
                for (i = 0; i < length; i += 1) {
                    const val = values[i];
                    if ((<any>cur)[name].indexOf(val) < 0) {
                        (<any>cur)[name].push(val);
                    }
                }

                // reset the built up state
                values.length = every = modifier = applyMin = applyMax = 0;
            }

            return {
                /**
                 * Set of constraints that must be met for an occurrence to be valid.
                 *
                 * @api public
                 */
                schedules: schedules,

                /**
                 * Set of exceptions that must not be met for an occurrence to be
                 * valid.
                 *
                 * @api public
                 */
                exceptions: exceptions,

                /**
                 * Specifies the specific instances of a time period that are valid.
                 * Must be followed by the desired time period (minute(), hour(),
                 * etc). For example, to specify a schedule for the 5th and 25th
                 * minute of every hour:
                 *
                 * recur().on(5, 25).minute();
                 *
                 * @param {Int} args: One or more valid instances
                 * @api public
                 */
                on: function (...args: (string | number | LaterDate)[]) {
                    values = _.isArray (args[0]) ? args[0] : args;
                    return this;
                },

                /**
                 * Specifies the recurring interval of a time period that are valid.
                 * Must be followed by the desired time period (minute(), hour(),
                 * etc). For example, to specify a schedule for every 4 hours in the
                 * day:
                 *
                 * recur().every(4).hour();
                 *
                 * @param {Int} x: Recurring interval
                 * @api public
                 */
                every: function (x: string | number = 1) {
                    every = _.isString(x) ? parseInt(x, 10) : x;
                    return this;
                },

                /**
                 * Specifies the minimum valid value.  For example, to specify a schedule
                 * that is valid for all hours after four:
                 *
                 * recur().after(4).hour();
                 *
                 * @param {Int} x: Recurring interval
                 * @api public
                 */
                after: function (x: string | number) {
                    modifier = 'a';
                    values = [convertToInteger(x)];
                    return this;
                },

                /**
                 * Specifies the maximum valid value.  For example, to specify a schedule
                 * that is valid for all hours before four:
                 *
                 * recur().before(4).hour();
                 *
                 * @param {Int} x: Recurring interval
                 * @api public
                 */
                before: function (x: string| number) {
                    modifier = 'b';
                    values = [convertToInteger(x)];
                    return this;
                },

                /**
                 * Specifies that the first instance of a time period is valid. Must
                 * be followed by the desired time period (minute(), hour(), etc).
                 * For example, to specify a schedule for the first day of every
                 * month:
                 *
                 * recur().first().dayOfMonth();
                 *
                 * @api public
                 */
                first: function () {
                    applyMin = 1;
                    return this;
                },

                /**
                 * Specifies that the last instance of a time period is valid. Must
                 * be followed by the desired time period (minute(), hour(), etc).
                 * For example, to specify a schedule for the last day of every year:
                 *
                 * recur().last().dayOfYear();
                 *
                 * @api public
                 */
                last: function () {
                    applyMax = 1;
                    return this;
                },

                /**
                 * Specifies a specific time that is valid. Time must be specified in
                 * hh:mm:ss format using 24 hour time. For example, to specify
                 * a schedule for 8:30 pm every day:
                 *
                 * recur().time('20:30:00');
                 *
                 * @param {String} time: Time in hh:mm:ss 24-hour format
                 * @api public
                 */
                time: function () {
                    //values = arguments;
                    for (var i = 0, len = values.length; i < len; i++) {
                        var split = values[i].split(':');
                        if (split.length < 3) split.push(0);
                        values[i] = +split[0] * 3600 + +split[1] * 60 + +split[2];
                    }

                    add('t');
                    return this;
                },

                /**
                 * Seconds time period, denotes seconds within each minute.
                 * Minimum value is 0, maximum value is 59. Specify 59 for last.
                 *
                 * recur().on(5, 15, 25).second();
                 *
                 * @api public
                 */
                second: function () {
                    add('s', 0, 59);
                    return this;
                },

                /**
                 * Minutes time period, denotes minutes within each hour.
                 * Minimum value is 0, maximum value is 59. Specify 59 for last.
                 *
                 * recur().on(5, 15, 25).minute();
                 *
                 * @api public
                 */
                minute: function () {
                    add('m', 0, 59);
                    return this;
                },

                /**
                 * Hours time period, denotes hours within each day.
                 * Minimum value is 0, maximum value is 23. Specify 23 for last.
                 *
                 * recur().on(5, 15, 25).hour();
                 *
                 * @api public
                 */
                hour: function () {
                    add('h', 0, 23);
                    return this;
                },

                /**
                 * Days of month time period, denotes number of days within a month.
                 * Minimum value is 1, maximum value is 31.  Specify 0 for last.
                 *
                 * recur().every(2).dayOfMonth();
                 *
                 * @api public
                 */
                dayOfMonth: function () {
                    add('D', 1, applyMax ? 0 : 31);
                    return this;
                },

                /**
                 * Days of week time period, denotes the days within a week.
                 * Minimum value is 1, maximum value is 7.  Specify 0 for last.
                 * 1 - Sunday
                 * 2 - Monday
                 * 3 - Tuesday
                 * 4 - Wednesday
                 * 5 - Thursday
                 * 6 - Friday
                 * 7 - Saturday
                 *
                 * recur().on(1).dayOfWeek();
                 *
                 * @api public
                 */
                dayOfWeek: function () {
                    add('d', 1, 7);
                    return this;
                },

                /**
                 * Short hand for on(1,7).dayOfWeek()
                 *
                 * @api public
                 */
                onWeekend: function () {
                    values = [1, 7];
                    return this.dayOfWeek();
                },

                /**
                 * Short hand for on(2,3,4,5,6).dayOfWeek()
                 *
                 * @api public
                 */
                onWeekday: function () {
                    values = [2, 3, 4, 5, 6];
                    return this.dayOfWeek();
                },

                /**
                 * Days of week count time period, denotes the number of times a
                 * particular day has occurred within a month.  Used to specify
                 * things like second Tuesday, or third Friday in a month.
                 * Minimum value is 1, maximum value is 5.  Specify 0 for last.
                 * 1 - First occurrence
                 * 2 - Second occurrence
                 * 3 - Third occurrence
                 * 4 - Fourth occurrence
                 * 5 - Fifth occurrence
                 * 0 - Last occurrence
                 *
                 * recur().on(1).dayOfWeek().on(1).dayOfWeekCount();
                 *
                 * @api public
                 */
                dayOfWeekCount: function () {
                    add('dc', 1, applyMax ? 0 : 5);
                    return this;
                },

                /**
                 * Days of year time period, denotes number of days within a year.
                 * Minimum value is 1, maximum value is 366.  Specify 0 for last.
                 *
                 * recur().every(2).dayOfYear();
                 *
                 * @api public
                 */
                dayOfYear: function () {
                    add('dy', 1, applyMax ? 0 : 366);
                    return this;
                },

                /**
                 * Weeks of month time period, denotes number of weeks within a
                 * month. The first week is the week that includes the 1st of the
                 * month. Subsequent weeks start on Sunday.
                 * Minimum value is 1, maximum value is 5.  Specify 0 for last.
                 * February 2nd,  2012 - Week 1
                 * February 5th,  2012 - Week 2
                 * February 12th, 2012 - Week 3
                 * February 19th, 2012 - Week 4
                 * February 26th, 2012 - Week 5 (or 0)
                 *
                 * recur().on(2).weekOfMonth();
                 *
                 * @api public
                 */
                weekOfMonth: function () {
                    add('wm', 1, applyMax ? 0 : 5);
                    return this;
                },

                /**
                 * Weeks of year time period, denotes the ISO 8601 week date. For
                 * more information see: http://en.wikipedia.org/wiki/ISO_week_date.
                 * Minimum value is 1, maximum value is 53.  Specify 0 for last.
                 *
                 * recur().every(2).weekOfYear();
                 *
                 * @api public
                 */
                weekOfYear: function () {
                    add('wy', 1, applyMax ? 0 : 53);
                    return this;
                },

                /**
                 * Month time period, denotes the months within a year.
                 * Minimum value is 1, maximum value is 12.  Specify 0 for last.
                 * 1 - January
                 * 2 - February
                 * 3 - March
                 * 4 - April
                 * 5 - May
                 * 6 - June
                 * 7 - July
                 * 8 - August
                 * 9 - September
                 * 10 - October
                 * 11 - November
                 * 12 - December
                 *
                 * recur().on(1).dayOfWeek();
                 *
                 * @api public
                 */
                month: function () {
                    add('M', 1, 12);
                    return this;
                },

                /**
                 * Year time period, denotes the four digit year.
                 * Minimum value is 1970, maximum value is Jan 1, 2100 (arbitrary)
                 *
                 * recur().on(2011, 2012, 2013).year();
                 *
                 * @api public
                 */
                year: function () {
                    add('Y', 1970, 2450);
                    return this;
                },

                /**
                 * Full date period, denotes a full date and time.
                 * Minimum value is Jan 1, 1970, maximum value is Jan 1, 2100 (arbitrary)
                 *
                 * recur().on(new Date(2013, 3, 2, 10, 30, 0)).fullDate();
                 *
                 * @api public
                 */
                fullDate: function () {
                    for (var i = 0, len = values.length; i < len; i++) {
                        values[i] = values[i].getTime();
                    }

                    add('fd');
                    return this;
                },

                /**
                 * Custom modifier.
                 *
                 * recur().on(2011, 2012, 2013).custom('partOfDay');
                 *
                 * @api public
                 */
                customModifier: function (id: string, ...vals: number[]) {
                    const custom = Object.keys(modifier).includes(id);
                    if (!custom) throw new Error('Custom modifier ' + id + ' not recognized!');

                    modifier = id;
                    values = vals;
                    return this;
                },

                /**
                 * Custom time period.
                 *
                 * recur().on(2011, 2012, 2013).customPeriod('partOfDay');
                 *
                 * @api public
                 */
                customPeriod: function (id: keyof Base) {
                    const custom: IConstraint | undefined = later[id] as IConstraint | undefined;
                    if (!custom) throw new Error('Custom time period ' + id + ' not recognized!');

                    add(id, custom.extent(new LaterDate())[0], custom.extent(new LaterDate())[1]);
                    return this;
                },

                /**
                 * Modifies a recurring interval (specified using every) to start
                 * at a given offset.  To create a schedule for every 5 minutes
                 * starting on the 6th minute - making minutes 6, 11, 16, etc valid:
                 *
                 * recur().every(5).minute().startingOn(6);
                 *
                 * @param {Int} start: The desired starting offset
                 * @api public
                 */
                startingOn: function (start: number) {
                    return this.between(start, last.m);
                },

                /**
                 * Modifies a recurring interval (specified using every) to start
                 * and stop at specified times.  To create a schedule for every
                 * 5 minutes starting on the 6th minute and ending on the 11th
                 * minute - making minutes 6 and 11 valid:
                 *
                 * recur().every(5).minute().between(6, 11);
                 *
                 * @param {Int} start: The desired starting offset
                 * @param {Int} end: The last valid value
                 * @api public
                 */
                between: function (start: number, end: number) {
                    // remove the values added as part of specifying the last
                    // time period and replace them with the new restricted values
                    (<any>cur)[last.n] = (<any>cur)[last.n].splice(0, last.c);
                    every = last.x;
                    add(last.n, start, end);
                    return this;
                },

                /**
                 * Creates a composite schedule.  With a composite schedule, a valid
                 * occurrence of any of the component schedules is considered a valid
                 * value for the composite schedule (e.g. they are OR'ed together).
                 * To create a schedule for every 5 minutes on Mondays and every 10
                 * minutes on Tuesdays:
                 *
                 * recur().every(5).minutes().on(1).dayOfWeek().and().every(10)
                 *    .minutes().on(2).dayOfWeek();
                 *
                 * @api public
                 */
                and: function () {
                    curArr.push({} as LaterDate);
                    cur = curArr[curArr.length - 1];
                    return this;
                },

                /**
                 * Creates exceptions to a schedule. Any valid occurrence of the
                 * exception schedule (which may also be composite schedules) is
                 * considered a invalid schedule occurrence. Everything that follows
                 * except will be treated as an exception schedule.  To create a
                 * schedule for 8:00 am every Tuesday except for patch Tuesday
                 * (second Tuesday each month):
                 *
                 * recur().at('08:00:00').on(2).dayOfWeek().except()
                 *    .dayOfWeekCount(1);
                 *
                 * @api public
                 */
                except: function () {
                    curArr = exceptions;
                    cur = null;
                    return this;
                },
            };
        },
        cron(expr: string, hasSeconds: boolean) {
            // Constant array to convert valid names to values
            const NAMES = {
                JAN: 1,
                FEB: 2,
                MAR: 3,
                APR: 4,
                MAY: 5,
                JUN: 6,
                JUL: 7,
                AUG: 8,
                SEP: 9,
                OCT: 10,
                NOV: 11,
                DEC: 12,
                SUN: 1,
                MON: 2,
                TUE: 3,
                WED: 4,
                THU: 5,
                FRI: 6,
                SAT: 7,
            };

            // Parsable replacements for common expressions
            const REPLACEMENTS = {
                '* * * * * *': '0/1 * * * * *',
                '@YEARLY': '0 0 1 1 *',
                '@ANNUALLY': '0 0 1 1 *',
                '@MONTHLY': '0 0 1 * *',
                '@WEEKLY': '0 0 * * 0',
                '@DAILY': '0 0 * * *',
                '@HOURLY': '0 * * * *',
            };

            // Contains the index, min, and max for each of the constraints
            const FIELDS = {
                s: [0, 0, 59], // seconds
                m: [1, 0, 59], // minutes
                h: [2, 0, 23], // hours
                D: [3, 1, 31], // day of month
                M: [4, 1, 12], // month
                Y: [6, 1970, 2099], // year
                d: [5, 1, 7, 1], // day of week
            };

            /**
             * Returns the value + offset if value is a number, otherwise it
             * attempts to look up the value in the NAMES table and returns
             * that result instead.
             *
             * @param {Int,String} value: The value that should be parsed
             * @param {Int} offset: Any offset that must be added to the value
             */
            function getValue(value: number | keyof typeof NAMES, offset?: number, max?: number) {
                return _.isString(value)
                    ? NAMES[value] || null
                    : Math.min(+value + (offset || 0), max || 9999);
            }

            /**
             * Returns a deep clone of a schedule skipping any day of week
             * constraints.
             *
             * @param {Sched} schedule: The schedule that will be cloned
             */
            function cloneSchedule(schedule: IScheduleDef): IScheduleDef {
                return Object(schedule).reduce((clone: IScheduleDef, field: string) => {
                    if (field !== 'dc' && field !== 'd') {
                        _.assign(clone, field, _.get(schedule, field));
                    }
                }, {});
            }

            /**
             * Adds values to the specified constraint in the current schedule.
             *
             * * @param {Schedule[]} schedules: The current schedule array to add to
             * @param {Schedule} sched: The schedule to add the constraint to
             * @param {String} name: Name of constraint to add
             * @param {Int} min: Minimum value for this constraint
             * @param {Int} max: Maximum value for this constraint
             * @param {Int} inc: The increment to use between min and max
             */
            function add(
                schedules: IScheduleDef[],
                sched: IScheduleDef,
                name: Exclude<keyof IScheduleDef, 'isUTC'>,
                min: number,
                max: number,
                inc?: number,
            ) {
                let i = min;

                if (!sched[name]) {
                    sched[name] = [];
                }

                if (name === 'd' && sched.dc && sched.dc.length > 0) {
                    schedules.push(cloneSchedule(sched));
                    sched = schedules[schedules.length - 1];
                    delete sched.dc;
                    _.assign(sched, name, _.get(sched, name, []));
                }
                const sn = sched[name];
                while (i <= max) {
                    if (!sn?.includes(i)) {
                        sn?.push(i);
                    }
                    i += inc || 1;
                }

                sn?.sort(function (a: number, b: number) {
                    return a - b;
                });

                return schedules[schedules.length - 1];
            }

            /**
             * Adds a hash item (of the form x#y or xL) to the schedule.
             *
             * @param {Schedule} schedules: The current schedule array to add to
             * @param {Schedule} curSched: The current schedule to add to
             * @param {Int} value: The value to add (x of x#y or xL)
             * @param {Int} hash: The hash value to add (y of x#y)
             */
            function addHash(
                schedules: IScheduleDef[],
                curSched: IScheduleDef,
                value: number,
                hash: number,
            ) {
                // if there are any existing day of week constraints that
                // aren't equal to the one we're adding, create a new
                // composite schedule
                if ((curSched.d && !curSched.dc) || (curSched.dc && !curSched.dc.includes(hash))) {
                    schedules.push(cloneSchedule(curSched));
                    curSched = schedules[schedules.length - 1];
                }

                curSched = add(schedules, curSched, 'd', value, value);
                curSched = add(schedules, curSched, 'dc', hash, hash);

                return curSched;
            }

            function addWeekday(
                schedules: IScheduleDef[],
                s: ISchedule,
                curSched: IScheduleDef,
                value: number,
            ) {
                var except1: IScheduleDef = {} as IScheduleDef,
                    except2: IScheduleDef = {} as IScheduleDef;
                if (value === 1) {
                    // cron doesn't pass month boundaries, so if 1st is a
                    // weekend then we need to use 2nd or 3rd instead
                    curSched = add(schedules, curSched, 'D', 1, 3);
                    curSched = add(schedules, curSched, 'd', NAMES.MON, NAMES.FRI);
                    curSched = add(schedules, except1, 'D', 2, 2);
                    curSched = add(schedules, except1, 'd', NAMES.TUE, NAMES.FRI);
                    curSched = add(schedules, except2, 'D', 3, 3);
                    curSched = add(schedules, except2, 'd', NAMES.TUE, NAMES.FRI);
                } else {
                    // normally you want the closest day, so if v is a
                    // Saturday, use the previous Friday.  If it's a
                    // sunday, use the following Monday.
                    curSched = add(schedules, curSched, 'D', value - 1, value + 1);
                    curSched = add(schedules, curSched, 'd', NAMES.MON, NAMES.FRI);
                    curSched = add(schedules, except1, 'D', value - 1, value - 1);
                    curSched = add(schedules, except1, 'd', NAMES.MON, NAMES.THU);
                    curSched = add(schedules, except2, 'D', value + 1, value + 1);
                    curSched = add(schedules, except2, 'd', NAMES.TUE, NAMES.FRI);
                }
                s.exceptions?.push(except1);
                s.exceptions?.push(except2);

                return curSched;
            }

            /**
             * Adds a range item (of the form x-y/z) to the schedule.
             *
             * @param {String} item: The cron expression item to add
             * @param {Schedule} curSched: The current schedule to add to
             * @param {String} name: The name to use for this constraint
             * @param {Int} min: The min value for the constraint
             * @param {Int} max: The max value for the constraint
             * @param {Int} offset: The offset to apply to the cron value
             */
            function addRange(
                schedules: IScheduleDef[],
                item: string,
                curSched: IScheduleDef,
                name: keyof IScheduleDef,
                min: number,
                max: number,
                offset: number,
            ) {
                // parse range/x
                var incSplit = item.split('/'),
                    inc = +incSplit[1],
                    range = incSplit[0];

                // parse x-y or * or 0
                if (range !== '*' && range !== '0') {
                    var rangeSplit = range.split('-').map(convertToInteger);
                    min = getValue(<any>rangeSplit[0], offset, max) || 0;

                    // fix for issue #13, range may be single digit
                    max = getValue(<any>rangeSplit[1], offset, max) || max;
                }

                curSched = add(schedules, curSched, name, min, max, inc);

                return curSched;
            }

            /**
             * Parses a particular item within a cron expression.
             *
             * @param {String} item: The cron expression item to parse
             * @param {Schedule} s: The existing set of schedules
             * @param {String} name: The name to use for this constraint
             * @param {Int} min: The min value for the constraint
             * @param {Int} max: The max value for the constraint
             * @param {Int} offset: The offset to apply to the cron value
             */
            function parse(
                item: string | number,
                s: ISchedule,
                name: keyof IScheduleDef,
                min: number,
                max: number,
                offset: number,
            ) {
                let value,
                    split,
                    schedules = s.schedules,
                    curSched = schedules[schedules.length - 1];

                // L just means min - 1 (this also makes it work for any field)
                if (item === 'L') {
                    item = min - 1;
                }

                // parse x
                if ((value = getValue(<any>item, offset, max)) !== null) {
                    add(schedules, curSched, name, value, value);
                }
                // parse xW
                else if (
                    _.isString(item) &&
                    (value = getValue(<any>item.replace('W', ''), offset, max)) !== null
                ) {
                    addWeekday(schedules, s, curSched, value);
                }
                // parse xL
                else if (
                    _.isString(item) &&
                    (value = getValue(<any>convertToInteger(item.replace('L', '')), offset, max)) !==
                        null
                ) {
                    addHash(schedules, curSched, value, min - 1);
                }
                // parse x#y
                else if (
                    _.isString(item) &&
                    (split = item.split('#').map(convertToInteger)).length === 2
                ) {
                    value = getValue(<any>split[0], offset, max) || max;
                    addHash(schedules, curSched, value, <any>getValue(<any>split[1]));
                }
                // parse x-y or x-y/z or */z or 0/z
                else {
                    addRange(schedules, <string>item, curSched, name, min, max, offset);
                }
            }

            /**
             * Returns true if the item is either of the form x#y or xL.
             *
             * @param {String} item: The expression item to check
             */
            function isHash(item: string) {
                return item.indexOf('#') > -1 || item.indexOf('L') > 0;
            }

            function itemSorter(a: string, b: string) {
                return isHash(a) && !isHash(b) ? 1 : parseInt(a, 10) - parseInt(b, 10);
            }

            /**
             * Parses each of the fields in a cron expression.  The expression must
             * include the seconds field, the year field is optional.
             *
             * @param {String} expr: The cron expression to parse
             */
            function parseExpr(expr: string) {
                let schedule: ISchedule = { schedules: [{}], exceptions: [] },
                    components = expr.replace(/(\s)+/g, ' ').split(' '),
                    field,
                    f: [number, number, number, number | undefined],
                    component: string,
                    items;

                for (field in FIELDS) {
                    f = (<any>FIELDS)[field];
                    component = components[f[0]];
                    if (component && component !== '*' && component !== '?') {
                        // need to sort so that any #'s come last, otherwise
                        // schedule clones to handle # won't contain all of the
                        // other constraints
                        items = component.split(',').sort(itemSorter).map(convertToInteger);
                        var i,
                            length = items.length;
                        for (i = 0; i < length; i++) {
                            parse(items[i], schedule, <any>field, f[1], f[2], f[3] ?? 0);
                        }
                    }
                }

                return schedule;
            }

            /**
             * Make cron expression parsable.
             *
             * @param {String} expr: The cron expression to prepare
             */
            function prepareExpr(expr: string) {
                const prepared = expr.toUpperCase();
                return (<any>REPLACEMENTS)[prepared] || prepared;
            }

            const e = prepareExpr(expr);
            return parseExpr(hasSeconds ? e : '0 ' + e);
        },
        text(str: string) {
            let recur = this.recur,
                pos = 0,
                input = '',
                error;

            // Regex expressions for all of the valid tokens
            const TOKENTYPES = TOKENTYPESGlobal;

            // Array to convert string names to valid numerical values
            const NAMES: { [k: string]: number } = {
                jan: 1,
                feb: 2,
                mar: 3,
                apr: 4,
                may: 5,
                jun: 6,
                jul: 7,
                aug: 8,
                sep: 9,
                oct: 10,
                nov: 11,
                dec: 12,
                sun: 1,
                mon: 2,
                tue: 3,
                wed: 4,
                thu: 5,
                fri: 6,
                sat: 7,
                '1st': 1,
                fir: 1,
                '2nd': 2,
                sec: 2,
                '3rd': 3,
                thi: 3,
                '4th': 4,
                for: 4,
            };

            /**
             * Bundles up the results of the peek operation into a token.
             *
             * @param {Int} start: The start position of the token
             * @param {Int} end: The end position of the token
             * @param {String} text: The actual text that was parsed
             * @param {TokenType} type: The TokenType of the token
             */
            function t(start: number, end: number, text: string, type?: ITOKENTYPES) {
                return { startPos: start, endPos: end, text: text, type: type };
            }

            /**
             * Peeks forward to see if the next token is the expected token and
             * returns the token if found.  Pos is not moved during a Peek operation.
             *
             * @param {TokenType} exepected: The types of token to scan for
             */
            function peek(expected: RegExp | RegExp[]): IParseText {
                var scanTokens = expected instanceof Array ? expected : [expected],
                    whiteSpace: RegExp = /\s+/,
                    token: IParseText | undefined = undefined,
                    curInput,
                    m,
                    scanToken,
                    start,
                    len;

                scanTokens.push(whiteSpace);

                // loop past any skipped tokens and only look for expected tokens
                start = pos;
                while (!token || token.type === whiteSpace) {
                    len = -1;
                    curInput = input.substring(start);
                    token = t(start, start, input.split(whiteSpace)[0]);

                    var i,
                        length = scanTokens.length;
                    for (i = 0; i < length; i++) {
                        scanToken = scanTokens[i];
                        m = scanToken.exec(curInput);
                        if (m && m.index === 0 && m[0].length > len) {
                            len = m[0].length;
                            token = t(start, start + len, curInput.substring(0, len), scanToken);
                        }
                    }

                    // update the start position if this token should be skipped
                    if (token.type === whiteSpace) {
                        start = token.endPos;
                    }
                }

                return token;
            }

            /**
             * Moves pos to the end of the expectedToken if it is found.
             *
             * @param {TokenType} exepectedToken: The types of token to scan for
             */
            function scan(expectedToken: ITOKENTYPES | ITOKENTYPES[]) {
                var token = peek(expectedToken);
                pos = token.endPos;
                return token;
            }

            /**
             * Parses the next 'y-z' expression and returns the resulting valid
             * value array.
             *
             * @param {TokenType} tokenType: The type of range values allowed
             */
            function parseThroughExpr(tokenType: ITOKENTYPES) {
                var start = +parseTokenValue(tokenType),
                    end = checkAndParse(TOKENTYPES.through) ? +parseTokenValue(tokenType) : start,
                    nums = [];

                for (var i = start; i <= end; i++) {
                    nums.push(i);
                }

                return nums;
            }

            /**
             * Parses the next 'x,y-z' expression and returns the resulting valid
             * value array.
             *
             * @param {TokenType} tokenType: The type of range values allowed
             */
            function parseRanges(tokenType: ITOKENTYPES) {
                var nums = parseThroughExpr(tokenType);
                while (checkAndParse(TOKENTYPES.and)) {
                    nums = nums.concat(parseThroughExpr(tokenType));
                }
                return nums;
            }

            /**
             * Parses the next 'every (weekend|weekday|x) (starting on|between)' expression.
             *
             * @param {Recur} r: The recurrence to add the expression to
             */
            function parseEvery(r: any) {
                var num, period: IParseText, start, end;

                if (checkAndParse(TOKENTYPES.weekend)) {
                    r.on(NAMES.sun, NAMES.sat).dayOfWeek();
                } else if (checkAndParse(TOKENTYPES.weekday)) {
                    r.on(NAMES.mon, NAMES.tue, NAMES.wed, NAMES.thu, NAMES.fri).dayOfWeek();
                } else {
                    num = parseTokenValue(TOKENTYPES.rank);
                    r.every(num);
                    period = parseTimePeriod(r);

                    if (checkAndParse(TOKENTYPES.start)) {
                        num = parseTokenValue(TOKENTYPES.rank);
                        r.startingOn(num);
                        parseToken(period.type);
                    } else if (checkAndParse(TOKENTYPES.between)) {
                        start = parseTokenValue(TOKENTYPES.rank);
                        if (checkAndParse(TOKENTYPES.and)) {
                            end = parseTokenValue(TOKENTYPES.rank);
                            r.between(start, end);
                        }
                    }
                }
            }

            /**
             * Parses the next 'on the (first|last|x,y-z)' expression.
             *
             * @param {Recur} r: The recurrence to add the expression to
             */
            function parseOnThe(r: any) {
                if (checkAndParse(TOKENTYPES.first)) {
                    r.first();
                } else if (checkAndParse(TOKENTYPES.last)) {
                    r.last();
                } else {
                    r.on(parseRanges(TOKENTYPES.rank));
                }

                parseTimePeriod(r);
            }

            /**
             * Parses the schedule expression and returns the resulting schedules,
             * and exceptions.  Error will return the position in the string where
             * an error occurred, will be null if no errors were found in the
             * expression.
             *
             * @param {String} str: The schedule expression to parse
             */
            function parseScheduleExpr(str: string) {
                pos = 0;
                input = str;
                error = -1;

                var r = recur();
                while (pos < input.length && error < 0) {
                    var token = parseToken([
                        TOKENTYPES.every,
                        TOKENTYPES.after,
                        TOKENTYPES.before,
                        TOKENTYPES.onthe,
                        TOKENTYPES.on,
                        TOKENTYPES.of,
                        TOKENTYPES['in'],
                        TOKENTYPES.at,
                        TOKENTYPES.and,
                        TOKENTYPES.except,
                        TOKENTYPES.also,
                    ]);

                    switch (token.type) {
                        case TOKENTYPES.every:
                            parseEvery(r);
                            break;
                        case TOKENTYPES.after:
                            if (peek(TOKENTYPES.time).type !== undefined) {
                                r.after(parseTokenValue(TOKENTYPES.time));
                                r.time();
                            } else {
                                r.after(parseTokenValue(TOKENTYPES.rank));
                                parseTimePeriod(r);
                            }
                            break;
                        case TOKENTYPES.before:
                            if (peek(TOKENTYPES.time).type !== undefined) {
                                r.before(parseTokenValue(TOKENTYPES.time));
                                r.time();
                            } else {
                                r.before(parseTokenValue(TOKENTYPES.rank));
                                parseTimePeriod(r);
                            }
                            break;
                        case TOKENTYPES.onthe:
                            parseOnThe(r);
                            break;
                        case TOKENTYPES.on:
                            r.on(...parseRanges(TOKENTYPES.dayName)).dayOfWeek();
                            break;
                        case TOKENTYPES.of:
                            r.on(...parseRanges(TOKENTYPES.monthName)).month();
                            break;
                        case TOKENTYPES['in']:
                            r.on(...parseRanges(TOKENTYPES.yearIndex)).year();
                            break;
                        case TOKENTYPES.at:
                            r.on(parseTokenValue(TOKENTYPES.time)).time();
                            while (checkAndParse(TOKENTYPES.and)) {
                                r.on(parseTokenValue(TOKENTYPES.time)).time();
                            }
                            break;
                        case TOKENTYPES.and:
                            break;
                        case TOKENTYPES.also:
                            r.and();
                            break;
                        case TOKENTYPES.except:
                            r.except();
                            break;
                        default:
                            error = pos;
                    }
                }

                return { schedules: r.schedules, exceptions: r.exceptions, error: error };
            }

            /**
             * Parses the next token representing a time period and adds it to
             * the provided recur object.
             *
             * @param {Recur} r: The recurrence to add the time period to
             */
            function parseTimePeriod(r: any): IParseText {
                var timePeriod = parseToken([
                    TOKENTYPES.second,
                    TOKENTYPES.minute,
                    TOKENTYPES.hour,
                    TOKENTYPES.dayOfYear,
                    TOKENTYPES.dayOfWeek,
                    TOKENTYPES.dayInstance,
                    TOKENTYPES.day,
                    TOKENTYPES.month,
                    TOKENTYPES.year,
                    TOKENTYPES.weekOfMonth,
                    TOKENTYPES.weekOfYear,
                ]);

                switch (timePeriod.type) {
                    case TOKENTYPES.second:
                        r.second();
                        break;
                    case TOKENTYPES.minute:
                        r.minute();
                        break;
                    case TOKENTYPES.hour:
                        r.hour();
                        break;
                    case TOKENTYPES.dayOfYear:
                        r.dayOfYear();
                        break;
                    case TOKENTYPES.dayOfWeek:
                        r.dayOfWeek();
                        break;
                    case TOKENTYPES.dayInstance:
                        r.dayOfWeekCount();
                        break;
                    case TOKENTYPES.day:
                        r.dayOfMonth();
                        break;
                    case TOKENTYPES.weekOfMonth:
                        r.weekOfMonth();
                        break;
                    case TOKENTYPES.weekOfYear:
                        r.weekOfYear();
                        break;
                    case TOKENTYPES.month:
                        r.month();
                        break;
                    case TOKENTYPES.year:
                        r.year();
                        break;
                    default:
                        error = pos;
                }

                return timePeriod;
            }

            /**
             * Checks the next token to see if it is of tokenType. Returns true if
             * it is and discards the token.  Returns false otherwise.
             *
             * @param {TokenType} tokenType: The type or types of token to parse
             */
            function checkAndParse(tokenType: ITOKENTYPES) {
                var found = peek(tokenType).type === tokenType;
                if (found) {
                    scan(tokenType);
                }
                return found;
            }

            /**
             * Parses and returns the next token.
             *
             * @param {TokenType} tokenType: The type or types of token to parse
             */
            function parseToken(tokenType: ITOKENTYPES | ITOKENTYPES[] | undefined) {
                if (!tokenType) {
                    throw new Error('undefined not allowed');
                }
                var t = scan(tokenType);
                if (t.type) {
                    t.text = convertString(t.text, tokenType);
                } else {
                    error = pos;
                }
                return t;
            }

            /**
             * Returns the text value of the token that was parsed.
             *
             * @param {TokenType} tokenType: The type of token to parse
             */
            function parseTokenValue(tokenType: ITOKENTYPES): string {
                return parseToken(tokenType).text;
            }

            /**
             * Converts a string value to a numerical value based on the type of
             * token that was parsed.
             *
             * @param {String} str: The schedule string to parse
             * @param {TokenType} tokenType: The type of token to convert
             */
            function convertString(str: string, tokenType: ITOKENTYPES | ITOKENTYPES[]): string {
                var output = str;

                switch (tokenType) {
                    case TOKENTYPES.time:
                        var parts: string[] = str.split(/(:|am|pm)/),
                            hour: string =
                                parts[3] === 'pm' && parseInt(parts[0], 10) < 12
                                    ? `${parseInt(parts[0], 10) + 12}`
                                    : parts[0],
                            min = parts[2].trim();

                        output = (hour.length === 1 ? '0' : '') + hour + ':' + min;
                        break;

                    case TOKENTYPES.rank:
                        const matches = /^\d+/.exec(str);
                        output = `${parseInt((matches ? <string[]>matches : ['0'])[0], 10)}`;
                        break;

                    case TOKENTYPES.monthName:
                    case TOKENTYPES.dayName:
                        const i: string = str.substring(0, 3),
                            q: any = NAMES[i];
                        output = `${q}`;
                        break;
                }

                return output;
            }

            return parseScheduleExpr(str.toLowerCase());
        },
    };
}
