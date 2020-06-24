/**
 * Set Interval
 * (c) 2013 Bill, BunKat LLC.
 *
 * Works similar to setInterval() but allows you to specify a Later schedule
 * instead of milliseconds.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */

import { Base } from '../later-base';
import { ISchedule } from './schedule';
import { laterSetTimeoutFactory } from "./settimeout";

export function laterSetIntervalFactory(later: Base) {
    const laterSetTimeout = laterSetTimeoutFactory(later);

    return function (fn: () => void, sched: ISchedule) {
        var t = laterSetTimeout(scheduleTimeout, sched),
            done = t.isDone();

        /**
         * Executes the specified function and then sets the timeout for the next
         * interval.
         */
        function scheduleTimeout() {
            if (!done) {
                fn();
                t = laterSetTimeout(scheduleTimeout, sched);
            }
        }

        return {
            isDone: function () {
                return t.isDone();
            },

            /**
             * Clears the timeout.
             */
            clear: function () {
                done = true;
                t.clear();
            },
        };
    }
}
