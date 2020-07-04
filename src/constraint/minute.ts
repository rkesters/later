/**
 * Minute Constraint (m)
 * (c) 2013 Bill, BunKat LLC.
 *
 * Definition for a minute constraint type.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */
import {IConstraint} from "./contraint";
import { date, LaterDate } from "../date/date";
import { Y } from "./year";
import { M } from "./month";
import { D } from "./day";
import { h } from "./hour";
import { MIN, SEC } from "../date/constant";
import { s } from "./second";
export const m: IConstraint = {
    /**
     * The name of this constraint.
     */
    name: 'minute',

    /**
     * The rough amount of seconds between start and end for this constraint.
     * (doesn't need to be exact)
     */
    range: 60,

    /**
     * The minute value of the specified date.
     *
     * @param {Date} d: The date to calculate the value of
     */
    val: function (d) {
        return d.m || (d.m = date.getMin.call(d));
    },

    /**
     * Returns true if the val is valid for the date specified.
     *
     * @param {Date} d: The date to check the value on
     * @param {Integer} val: The value to validate
     */
    isValid: function (d, val) {
        return m.val(d) === val;
    },

    /**
     * The minimum and maximum valid minute values.
     */
    extent: function (d) {
        return [0, 59];
    },

    /**
     * The start of the minute of the specified date.
     *
     * @param {Date} d: The specified date
     */
    start: function (d) {
        return (
            d.mStart ||
            (d.mStart = date.next(
                Y.val(d),
                M.val(d),
                D.val(d),
                h.val(d),
                m.val(d),
            ))
        );
    },

    /**
     * The end of the minute of the specified date.
     *
     * @param {Date} d: The specified date
     */
    end: function (d) {
        return (
            d.mEnd ||
            (d.mEnd = date.prev(
                Y.val(d),
                M.val(d),
                D.val(d),
                h.val(d),
                m.val(d),
            ))
        );
    },

    /**
     * Returns the start of the next instance of the minute value indicated.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    next: function (d, val) {
        let mm = m.val(d),
            ss = s.val(d),
            inc = val > 59 ? 60 - mm : val <= mm ? 60 - mm + val : val - mm,
            next = new LaterDate(d.getTime() + inc * MIN - ss * SEC);


        // correct for passing over a daylight savings boundry
        if (!date.isUTC && next.getTime() <= d.getTime()) {
            next = new LaterDate(d.getTime() + (inc + 120) * MIN - ss * SEC);
        }

        return next;
    },

    /**
     * Returns the end of the previous instance of the minute value indicated.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    prev: function (d, val) {
        val = val > 59 ? 59 : val;

        return date.prev(
            Y.val(d),
            M.val(d),
            D.val(d),
            h.val(d) + (val >= m.val(d) ? -1 : 0),
            val,
        );
    },
};

export const minute = m;
