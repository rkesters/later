/**
 * Set Timeout
 * (c) 2013 Bill, BunKat LLC.
 *
 * Works similar to setTimeout() but allows you to specify a Later schedule
 * instead of milliseconds.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */

import * as _ from 'lodash';

export function laterSetTimeout(fn: () => void, sched: ISchedule): LaterSetTimeoutFnResult {
    var s = later.schedule(sched),
        t: ReturnType<typeof setTimeout> | undefined;

    scheduleTimeout();

    /**
     * Schedules the timeout to occur. If the next occurrence is greater than the
     * max supported delay (2147483647 ms) than we delay for that amount before
     * attempting to schedule the timeout again.
     */
    function scheduleTimeout() {
        var now = new LaterDate(),
            next = s.next(2, now);

        if (!_.isArray(next)) {
            return;
        }
        if (!next[0]) {
            t = undefined;
            return;
        }

        if (_.isArray(next[0]) || _.isArray(next[1])) {
            return;
        }

        var diff = next[0]?.getTime() - now.getTime();

        // minimum time to fire is one second, use next occurrence instead
        if (diff < 1000) {
            diff = next[1] ? next[1].getTime() - now.getTime() : 1000;
        }

        if (diff < 2147483647) {
            t = setTimeout(fn, diff);
        } else {
            t = setTimeout(scheduleTimeout, 2147483647);
        }
    }

    return {
        isDone: function () {
            return !t;
        },

        /**
         * Clears the timeout.
         */
        clear: function () {
            t && clearTimeout(t);
        },
    };
}

later.setTimeout = laterSetTimeout;
