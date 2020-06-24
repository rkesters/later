/**
 * Schedule
 * (c) 2013 Bill, BunKat LLC.
 *
 * Returns an object to calculate future or previous occurrences of the
 * specified schedule.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */

 import * as _ from 'lodash'


export function schedule(scheduled: ISchedule):IScheduleResult {
    if (!scheduled) throw new Error('Missing schedule definition.');
    if (!scheduled.schedules) throw new Error('Definition must include at least one schedule.');

    // compile the schedule components
    const schedules: ICompiledSchedule[] = [],
        schedulesLen = scheduled.schedules.length,
        exceptions: ICompiledSchedule[] = [],
        exceptionsLen = scheduled.exceptions ? scheduled.exceptions.length : 0;

    for (let i = 0; i < schedulesLen; i++) {
        schedules.push(later.compile(scheduled.schedules[i]));
    }

    for (let j = 0; j < exceptionsLen; j++) {
        exceptions.push(later.compile(scheduled.exceptions[j]));
    }

    /**
     * Calculates count number of instances or ranges for the current schedule,
     * optionally between the specified startDate and endDate.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Integer} count: The number of instances or ranges to return
     * @param {Date} startDate: The earliest date a valid instance can occur on
     * @param {Date} endDate: The latest date a valid instance can occur on
     * @param {Bool} isRange: True to return ranges, false to return instances
     */
    function getInstances(
        dir: DIRECTION,
        count: number,
        startDate: LaterDate,
        endDate?: LaterDate,
        isRange: boolean = false,
    ) {
        let compare = compareFn(dir), // encapsulates difference between directions
            loopCount = count,
            maxAttempts = 1000,
            schedStarts: LaterDate[] = [],
            exceptStarts: LaterDate[][] = [],
            next,
            end: LaterDate | undefined,
            results: Array<Date | Array<Date | undefined> | undefined> = [],
            isForward = dir === 'next',
            lastResult,
            rStart = isForward ? 0 : 1,
            rEnd = isForward ? 1 : 0;

        startDate = startDate ? new LaterDate(startDate) : new LaterDate();
        if (!startDate || !startDate.getTime()) throw new Error('Invalid start date.');

        // Step 1: calculate the earliest start dates for each schedule and exception
        setNextStarts(dir, schedules, schedStarts, startDate);
        setRangeStarts(dir, exceptions, exceptStarts, startDate);

        // Step 2: select the earliest of the start dates calculated
        while (maxAttempts-- && loopCount && (next = findNext(schedStarts, compare))) {
            // Step 3: make sure the start date we found is in range
            if (endDate && compare(next, endDate)) {
                break;
            }

            // Step 4: make sure we aren't in the middle of an exception range
            if (exceptionsLen) {
                updateRangeStarts(dir, exceptions, exceptStarts, next);
                if ((end = calcRangeOverlap(dir, exceptStarts, next))) {
                    updateNextStarts(dir, schedules, schedStarts, end);
                    continue;
                }
            }

            // Step 5: Date is good, if range, find the end of the range and update start dates
            if (isRange) {
                const maxEndDate = calcMaxEndDate(exceptStarts, compare);
                end = calcEnd(dir, schedules, schedStarts, next, maxEndDate);
                const r: (Date | undefined)[] = isForward
                    ? [
                          new Date(Math.max(startDate.getTime(), next.getTime())),
                          end
                              ? new Date(endDate ? Math.min(end.getTime(), endDate.getTime()) : end)
                              : undefined,
                      ]
                    : [
                          end
                              ? new Date(
                                    endDate
                                        ? Math.max(endDate.getTime(), end.getTime() + later.SEC)
                                        : end.getTime() + later.SEC,
                                )
                              : undefined,
                          new Date(Math.min(startDate.getTime(), next.getTime() + later.SEC)),
                      ];

                // make sure start of this range doesn't overlap with the end of the
                // previous range
                if (lastResult && r[rStart]?.getTime() === lastResult[rEnd]?.getTime()) {
                    lastResult[rEnd] = r[rEnd];
                    loopCount++; // correct the count since this isn't a new range
                } else {
                    lastResult = r;
                    results.push(lastResult);
                }

                if (!end) break; // last iteration valid until the end of time
                updateNextStarts(dir, schedules, schedStarts, end);
            }
            // otherwise store the start date and tick the start dates
            else {
                results.push(
                    isForward
                        ? new Date(Math.max(startDate.getTime(), next.getTime()))
                        : getStart(schedules, schedStarts, next, endDate),
                );

                tickStarts(dir, schedules, schedStarts, next);
            }

            loopCount--;
        }

        // clean the dates that will be returned to remove any cached properties
        // that were added during the schedule process
        let i = 0,
            len = results.length;
        for (; i < len; i++) {
            const result = results[i];
            results[i] = _.isArray(result)
                ? [cleanDate(result[0]), cleanDate(result[1])]
                : cleanDate(result);
        }

        return results.length === 0 ? later.NEVER : count === 1 ? results[0] : results;
    }

    function cleanDate(d: Date | undefined) {
        if (d instanceof Date && !isNaN(d.valueOf())) {
            return new Date(d);
        }

        return undefined;
    }

    /**
     * Initially sets the first valid next start times
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} startsArr: The set of cached start dates for the schedules
     * @param {Date} startDate: Starts earlier than this date will be calculated
     */
    function setNextStarts(
        dir: DIRECTION,
        schedArr: ICompiledSchedule[],
        startsArr: Date[],
        startDate: LaterDate,
    ) {
        for (var i = 0, len = schedArr.length; i < len; i++) {
            startsArr[i] = schedArr[i].start(dir, startDate);
        }
    }

    /**
     * Updates the set of cached start dates to the next valid start dates. Only
     * schedules where the current start date is less than or equal to the
     * specified startDate need to be updated.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} startsArr: The set of cached start dates for the schedules
     * @param {Date} startDate: Starts earlier than this date will be calculated
     */
    function updateNextStarts(
        dir: DIRECTION,
        schedArr: ICompiledSchedule[],
        startsArr: LaterDate[],
        startDate: LaterDate,
    ) {
        var compare = compareFn(dir);

        for (var i = 0, len = schedArr.length; i < len; i++) {
            if (startsArr[i] && !compare(startsArr[i], startDate)) {
                startsArr[i] = schedArr[i].start(dir, startDate);
            }
        }
    }

    /**
     * Updates the set of cached ranges to the next valid ranges. Only
     * schedules where the current start date is less than or equal to the
     * specified startDate need to be updated.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} startsArr: The set of cached start dates for the schedules
     * @param {Date} startDate: Starts earlier than this date will be calculated
     */
    function setRangeStarts(
        dir: DIRECTION,
        schedArr: ICompiledSchedule[],
        rangesArr: Array<number | LaterDate[] | LaterDate>,
        startDate: LaterDate,
    ) {
        var compare = compareFn(dir);

        for (var i = 0, len = schedArr.length; i < len; i++) {
            const nextStart: LaterDate = schedArr[i].start(dir, startDate);

            if (!nextStart) {
                rangesArr[i] = later.NEVER;
            } else {
                rangesArr[i] = [nextStart, schedArr[i].end(dir, nextStart)];
            }
        }
    }

    /**
     * Updates the set of cached ranges to the next valid ranges. Only
     * schedules where the current start date is less than or equal to the
     * specified startDate need to be updated.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} startsArr: The set of cached start dates for the schedules
     * @param {Date} startDate: Starts earlier than this date will be calculated
     */
    function updateRangeStarts(
        dir: DIRECTION,
        schedArr: ICompiledSchedule[],
        rangesArr: Array<number | LaterDate[] | LaterDate>,
        startDate: LaterDate,
    ) {
        const compare = compareFn(dir);

        let i = 0,
            len = schedArr.length;
        for (; i < len; i++) {
            if (!_.isArray(rangesArr[i])) {
                continue;
            }
            const currentRange: LaterDate[] = rangesArr[i] as LaterDate[];
            if (currentRange && !compare(currentRange[0], startDate)) {
                const nextStart = schedArr[i].start(dir, startDate);

                if (!nextStart) {
                    rangesArr[i] = later.NEVER;
                } else {
                    rangesArr[i] = [nextStart, schedArr[i].end(dir, nextStart)];
                }
            }
        }
    }

    /**
     * Increments all schedules with next start equal to startDate by one tick.
     * Tick size is determined by the smallest constraint within a schedule.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} startsArr: The set of cached start dates for the schedules
     * @param {Date} startDate: The date that should cause a schedule to tick
     */
    function tickStarts(
        dir: DIRECTION,
        schedArr: ICompiledSchedule[],
        startsArr: LaterDate[],
        startDate: LaterDate,
    ) {
        for (var i = 0, len = schedArr.length; i < len; i++) {
            if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {
                startsArr[i] = schedArr[i].start(dir, schedArr[i].tick(dir, startDate));
            }
        }
    }

    /**
     * Determines the start date of the schedule that produced startDate
     *
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} startsArr: The set of cached start dates for the schedules
     * @param {Date} startDate: The date that should cause a schedule to tick
     * @param {Date} minEndDate: The minimum end date to return
     */
    function getStart(
        schedArr: ICompiledSchedule[],
        startsArr: LaterDate[],
        startDate: LaterDate,
        minEndDate?: LaterDate,
    ) {
        let result;

        let i = 0,
            len = startsArr.length;
        for (; i < len; i++) {
            if (startsArr[i] && startsArr[i].getTime() === startDate.getTime()) {
                var start = schedArr[i].tickStart(startDate);

                if (minEndDate && start < minEndDate) {
                    return minEndDate;
                }

                if (!result || start > result) {
                    result = start;
                }
            }
        }

        return result;
    }

    /**
     * Calculates the end of the overlap between any exception schedule and the
     * specified start date. Returns undefined if there is no overlap.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} rangesArr: The set of cached start dates for the schedules
     * @param {Date} startDate: The valid date for which the overlap will be found
     */
    function calcRangeOverlap(
        dir: DIRECTION,
        rangesArr: Array<number | LaterDate[]>,
        startDate: LaterDate,
    ) {
        let compare = compareFn(dir),
            result: LaterDate | undefined;

        let i = 0,
            len = rangesArr.length;
        for (; i < len; i++) {
            if (!_.isArray(rangesArr[i])) {
                continue;
            }
            const range: LaterDate[] = rangesArr[i] as LaterDate[];

            if (
                range &&
                !compare(range[0], startDate) &&
                (!range[1] || compare(range[1], startDate))
            ) {
                // startDate is in the middle of an exception range
                if (!result || compare(range[1], result)) {
                    result = range[1];
                }
            }
        }

        return result;
    }

    /**
     * Calculates the earliest start of an exception schedule, this is the maximum
     * end date of the schedule.
     *
     * @param {Array} exceptsArr: The set of cached exception ranges
     * @param {Array} compare: The compare function to use to determine earliest
     */
    function calcMaxEndDate(
        exceptsArr: LaterDate[][],
        compare: (a: Date, b: Date) => boolean,
    ): LaterDate | undefined {
        let result: LaterDate | undefined = undefined;

        let i = 0,
            len = exceptsArr.length;
        for (; i < len; i++) {
            if (exceptsArr[i] && result && compare(result, exceptsArr[i][0])) {
                result = exceptsArr[i][0];
            }
        }

        return result;
    }

    /**
     * Calculates the next invalid date for a particular schedules starting from
     * the specified valid start date.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     * @param {Array} schedArr: The set of compiled schedules to use
     * @param {Array} startsArr: The set of cached start dates for the schedules
     * @param {Date} startDate: The valid date for which the end date will be found
     * @param {Date} maxEndDate: The latested possible end date or null for none
     */
    function calcEnd(
        dir: DIRECTION,
        schedArr: ICompiledSchedule[],
        startsArr: LaterDate[],
        startDate: LaterDate,
        maxEndDate?: LaterDate,
    ): LaterDate | undefined {
        let compare = compareFn(dir),
            result: LaterDate | undefined;

        let i = 0,
            len = schedArr.length;
        for (; i < len; i++) {
            const start = startsArr[i];

            if (start && start.getTime() === startDate.getTime()) {
                const end: LaterDate = schedArr[i].end(dir, start);

                // if the end date is past the maxEndDate, just return the maxEndDate
                if (maxEndDate && (!end || compare(end, maxEndDate))) {
                    return maxEndDate;
                }

                // otherwise, return the maximum end date that was calculated
                if (!result || compare(end, result)) {
                    result = end;
                }
            }
        }

        return result;
    }

    /**
     * Returns a function to use when comparing two dates. Encapsulates the
     * difference between searching for instances forward and backwards so that
     * the same code can be completely reused for both directions.
     *
     * @param {String} dir: The direction to use, either 'next' or 'prev'
     */
    function compareFn(dir: DIRECTION): (a: Date, b: Date) => boolean {
        return dir === 'next'
            ? function (a, b) {
                  return !b || a.getTime() > b.getTime();
              }
            : function (a, b) {
                  return !a || b.getTime() > a.getTime();
              };
    }

    /**
     * Returns the next value in an array using the function passed in as compare
     * to do the comparison. Skips over null or undefined values.
     *
     * @param {Array} arr: The array of values
     * @param {Function} compare: The comparison function to use
     */
    function findNext<T>(arr: T[], compare: (a: T, b: T) => boolean): T {
        let next: T = arr[0];

        let i = 1,
            len = arr.length;
        for (; i < len; i++) {
            if (arr[i] && compare(next, arr[i])) {
                next = arr[i];
            }
        }

        return next;
    }

    return {
        /**
         * Returns true if d is a valid occurrence of the current schedule.
         *
         * @param {Date} d: The date to check
         */
        isValid: function (d: LaterDate) {
            return getInstances('next', 1, d, d) !== later.NEVER;
        },

        /**
         * Finds the next valid instance or instances of the current schedule,
         * optionally between a specified start and end date. Start date is
         * Date.now() by default, end date is unspecified. Start date must be
         * smaller than end date.
         *
         * @param {Integer} count: The number of instances to return
         * @param {Date} startDate: The earliest a valid instance can occur
         * @param {Date} endDate: The latest a valid instance can occur
         */
        next: function (count: number, startDate: LaterDate, endDate?: LaterDate) {
            return getInstances('next', count || 1, startDate, endDate);
        },

        /**
         * Finds the previous valid instance or instances of the current schedule,
         * optionally between a specified start and end date. Start date is
         * Date.now() by default, end date is unspecified. Start date must be
         * greater than end date.
         *
         * @param {Integer} count: The number of instances to return
         * @param {Date} startDate: The earliest a valid instance can occur
         * @param {Date} endDate: The latest a valid instance can occur
         */
        prev: function (count: number, startDate: LaterDate, endDate: LaterDate) {
            return getInstances('prev', count || 1, startDate, endDate);
        },

        /**
         * Finds the next valid range or ranges of the current schedule,
         * optionally between a specified start and end date. Start date is
         * Date.now() by default, end date is unspecified. Start date must be
         * greater than end date.
         *
         * @param {Integer} count: The number of ranges to return
         * @param {Date} startDate: The earliest a valid range can occur
         * @param {Date} endDate: The latest a valid range can occur
         */
        nextRange: function (count: number, startDate: LaterDate, endDate: LaterDate) {
            return getInstances('next', count || 1, startDate, endDate, true);
        },

        /**
         * Finds the previous valid range or ranges of the current schedule,
         * optionally between a specified start and end date. Start date is
         * Date.now() by default, end date is unspecified. Start date must be
         * greater than end date.
         *
         * @param {Integer} count: The number of ranges to return
         * @param {Date} startDate: The earliest a valid range can occur
         * @param {Date} endDate: The latest a valid range can occur
         */
        prevRange: function (count: number, startDate: LaterDate, endDate: LaterDate) {
            return getInstances('prev', count || 1, startDate, endDate, true);
        },
    };
}

later.schedule = schedule;
