/**
 * Compile
 * (c) 2013 Bill, BunKat LLC.
 *
 * Compiles a single schedule definition into a form from which instances can be
 * efficiently calculated from.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */
import * as _ from 'lodash';

import { array } from '../array/array';
import { IConstraint } from '../constraint/contraint';
import { NEVER, SEC } from '../date/constant';
import { LaterDate } from '../date/date';
import { Base } from '../later-base';
import { IModifier, modifier } from '../modifier/modifier';

interface ICompileConstraint {
    vals: number[];
    constraint: IConstraint;
}

export interface IScheduleDefFull {
    day: number[];
    D: number[];
    dw: number[];
    d: number[];
    dayOfWeek: number[];
    dayOfWeekCount: number[];
    dc: number[];
    dy: number[];
    fd: number[];
    fd_a: number[];
    fd_b: number[];
    h: number[];
    m: number[];
    M: number[];
    s: number[];
    t: number[];
    wm: number[];
    wy: number[];
    Y: number[];
    Y_a: number[];
    /* YStart: LaterDate;
    YEnd: LaterDate;
    wyExtent: [number, number];
    wyStart: LaterDate;
    wyEnd: LaterDate;
    wmStart: LaterDate;
    wmEnd: LaterDate;
    wmExtent: [number, number];
    sStart: number;
    sEnd: number;
    MStart: number;
    MEnd: number;
    mStart: number;
    mEnd: number;
    hStart: LaterDate;
    hEnd: LaterDate;
    dyExtent: [number, number];
    dcExtent: [number, number];
    dcStart: number;
    dcEnd: number;
    DExtent: [number, number];
    DStart: LaterDate;
    DEnd: LaterDate;
    */
}

export type IScheduleDef = Partial<IScheduleDefFull>;

export interface ICompiledSchedule {
    /**
     * Calculates the start of the next valid occurrence of a particular schedule
     * that occurs on or after the specified start time.
     *
     * @param {String} dir: ion to search in ('next' or 'prev')
     * @param {Date} startDate: The first possible valid occurrence
     */
    start: (dir: 'next' | 'prev', startDate: LaterDate) => LaterDate;
    /**
     * Given a valid start time, finds the next schedule that is invalid.
     * Useful for finding the end of a valid time range.
     *
     * @param {Date} startDate: The first possible valid occurrence
     */
    end: (dir: 'next' | 'prev', startDate: LaterDate) => LaterDate | undefined;
    /**
     * Ticks the date by the minimum constraint in this schedule
     *
     * @param {String} dir: ion to tick in ('next' or 'prev')
     * @param {Date} date: The start date to tick from
     */
    tick: (dir: 'next' | 'prev', date: LaterDate) => LaterDate;
    /**
     * Ticks the date to the start of the minimum constraint
     *
     * @param {Date} date: The start date to tick from
     */
    tickStart: (date: LaterDate) => LaterDate;
}

export function compileFactory(later: Base) {
    return function (schedDef: IScheduleDef): ICompiledSchedule {
        let constraints: ICompileConstraint[] = [],
            constraintsLen = 0,
            tickConstraint: IConstraint;

        let key: keyof IScheduleDef;
        for (key in schedDef) {
            const nameParts = key.split('_'),
                name = nameParts[0],
                mod = nameParts[1] as keyof IModifier,
                vals = schedDef[key] ?? [],
                constraint = mod
                    ? _.get<IModifier, keyof IModifier>(modifier, mod)(_.get(later, name), vals)
                    : (_.get(later, name) as IConstraint);

            constraints.push({ constraint, vals });
            constraintsLen++;
        }

        // sort constraints based on their range for best performance (we want to
        // always skip the largest block of time possible to find the next valid
        // value)
        constraints.sort(function (a, b) {
            var ra = a.constraint.range,
                rb = b.constraint.range;
            return rb < ra ? -1 : rb > ra ? 1 : 0;
        });

        // this is the smallest constraint, we use this one to tick the schedule when
        // finding multiple instances
        tickConstraint = constraints[constraintsLen - 1].constraint;

        /**
         * Returns a function to use when comparing two dates. Encapsulates the
         * difference between searching for instances forward and backwards so that
         * the same code can be completely reused for both ions.
         *
         * @param {String} dir: The ion to use, either 'next' or 'prev'
         */
        function compareFn(dir: 'next' | 'prev') {
            return dir === 'next'
                ? function (a: Date, b: Date) {
                      return a.getTime() > b.getTime();
                  }
                : function (a: Date, b: Date) {
                      return b.getTime() > a.getTime();
                  };
        }

        return {
            /**
             * Calculates the start of the next valid occurrence of a particular schedule
             * that occurs on or after the specified start time.
             *
             * @param {String} dir: ion to search in ('next' or 'prev')
             * @param {Date} startDate: The first possible valid occurrence
             */
            start: function (dir: 'next' | 'prev', startDate: LaterDate): LaterDate {
                let next = startDate,
                    nextVal = array[dir],
                    maxAttempts = 1000,
                    done;

                while (maxAttempts-- && !done && next && next != NEVER) {
                    done = true;

                    // verify all of the constraints in order since we want to make the
                    // largest jumps possible to find the first valid value
                    for (let i = 0; i < constraintsLen; i++) {
                        const constraint = constraints[i].constraint,
                            curVal = constraint.val(next),
                            extent = constraint.extent(next),
                            newVal = nextVal(curVal, constraints[i].vals, extent);

                        if (!constraint.isValid(next, newVal)) {
                            next = constraint[dir](next, newVal);
                            done = false;
                            break; // need to retest all constraints with new date
                        }
                    }
                }

                if (next !== NEVER) {
                    next = dir === 'next' ? tickConstraint.start(next) : tickConstraint.end(next);
                }

                // if next, move to start of time period. needed when moving backwards
                return next;
            },

            /**
             * Given a valid start time, finds the next schedule that is invalid.
             * Useful for finding the end of a valid time range.
             *
             * @param {Date} startDate: The first possible valid occurrence
             */
            end: function (dir: 'next' | 'prev', startDate: LaterDate): LaterDate | undefined {
                let result: LaterDate | null = null,
                    nextVal = dir === 'next' ? array.nextInvalid : array.prevInvalid,
                    compare = compareFn(dir);

                return (
                    constraints.reduce(
                        (result: LaterDate | null, { constraint, vals }: ICompileConstraint) => {
                            let curVal = constraint.val(startDate),
                                extent = constraint.extent(startDate),
                                newVal = nextVal(curVal, vals, extent),
                                next;

                            if (newVal !== undefined) {
                                // constraint has invalid value, use that
                                next =
                                    dir === 'next'
                                        ? constraint.next(startDate, newVal)
                                        : constraint.prev(startDate, newVal);
                                if (next && (!result || compare(result, next))) {
                                    result = next;
                                }
                            }

                            return result;
                        },
                        null,
                    ) || undefined
                );
            },

            /**
             * Ticks the date by the minimum constraint in this schedule
             *
             * @param {String} dir: ion to tick in ('next' or 'prev')
             * @param {Date} date: The start date to tick from
             */
            tick: function (dir: 'next' | 'prev', date: LaterDate) {
                const a =
                    dir === 'next'
                        ? tickConstraint.end(date).getTime() + SEC
                        : tickConstraint.start(date).getTime() - SEC;
                return new LaterDate(a);
            },

            /**
             * Ticks the date to the start of the minimum constraint
             *
             * @param {Date} date: The start date to tick from
             */
            tickStart: function (date: LaterDate) {
                return tickConstraint.start(date);
            },
        };
    };
}
