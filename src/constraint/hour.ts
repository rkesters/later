/**
 * Hour Constraint (H)
 * (c) 2013 Bill, BunKat LLC.
 *
 * Definition for a hour constraint type.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */
import {IConstraint} from "./contraint";
import { date } from "../date/date";
import { Y } from "./year";
import { M } from "./month";
import { D } from "./day";
export const h: IConstraint = {
    /**
     * The name of this constraint.
     */
    name: 'hour',

    /**
     * The rough amount of seconds between start and end for this constraint.
     * (doesn't need to be exact)
     */
    range: 3600,

    /**
     * The hour value of the specified date.
     *
     * @param {Date} d: The date to calculate the value of
     */
    val: function (d) {
        return d.h || (d.h = date.getHour.call(d));
    },

    /**
     * Returns true if the val is valid for the date specified.
     *
     * @param {Date} d: The date to check the value on
     * @param {Integer} val: The value to validate
     */
    isValid: function (d, val) {
        return h.val(d) === val;
    },

    /**
     * The minimum and maximum valid hour values.
     */
    extent: function () {
        return [0, 23];
    },

    /**
     * The start of the hour of the specified date.
     *
     * @param {Date} d: The specified date
     */
    start: function (d) {
        return (
            d.hStart ||
            (d.hStart = date.next(
                Y.val(d),
                M.val(d),
                D.val(d),
                h.val(d),
            ))
        );
    },

    /**
     * The end of the hour of the specified date.
     *
     * @param {Date} d: The specified date
     */
    end: function (d) {
        return (
            d.hEnd ||
            (d.hEnd = date.prev(
                Y.val(d),
                M.val(d),
                D.val(d),
                h.val(d),
            ))
        );
    },

    /**
     * Returns the start of the next instance of the hour value indicated.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    next: function (d, val) {
        val = val > 23 ? 0 : val;

        var next = date.next(
            Y.val(d),
            M.val(d),
            D.val(d) + (val <= h.val(d) ? 1 : 0),
            val,
        );

        // correct for passing over a daylight savings boundry
        if (!date.isUTC && next.getTime() <= d.getTime()) {
            next = date.next(
                Y.val(next),
                M.val(next),
                D.val(next),
                val + 1,
            );
        }

        return next;
    },

    /**
     * Returns the end of the previous instance of the hour value indicated.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    prev: function (d, val) {
        val = val > 23 ? 23 : val;

        return date.prev(
            Y.val(d),
            M.val(d),
            D.val(d) + (val >= h.val(d) ? -1 : 0),
            val,
        );
    },
};

export const hour = h;
