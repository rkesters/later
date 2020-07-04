/**
 * Second Constraint (s)
 * (c) 2013 Bill, BunKat LLC.
 *
 * Definition for a second constraint type.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */
import {IConstraint} from "./contraint";
import { date, LaterDate } from "../date/date";
import { m } from "./minute";
import { h } from "./hour";
import { M } from "./month";
import { Y } from "./year";
import { D } from "./day";
import { SEC } from "../date/constant";
export const s: IConstraint = {
    /**
     * The name of this constraint.
     */
    name: 'second',

    /**
     * The rough amount of seconds between start and end for this constraint.
     * (doesn't need to be exact)
     */
    range: 1,

    /**
     * The second value of the specified date.
     *
     * @param {Date} d: The date to calculate the value of
     */
    val: function (d) {
        return d.s || (d.s = date.getSec.call(d));
    },

    /**
     * Returns true if the val is valid for the date specified.
     *
     * @param {Date} d: The date to check the value on
     * @param {Integer} val: The value to validate
     */
    isValid: function (d, val) {
        return s.val(d) === val;
    },

    /**
     * The minimum and maximum valid second values.
     */
    extent: function () {
        return [0, 59];
    },

    /**
     * The start of the second of the specified date.
     *
     * @param {Date} d: The specified date
     */
    start: function (d) {
        return d;
    },

    /**
     * The end of the second of the specified date.
     *
     * @param {Date} d: The specified date
     */
    end: function (d) {
        return d;
    },

    /**
     * Returns the start of the next instance of the second value indicated.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    next: function (d, val) {
        let ss: number = s.val(d),
            inc = val > 59 ? 60 - ss : val <= ss ? 60 - ss + val : val - ss,
            next = new LaterDate(d.getTime() + inc * SEC);

        // correct for passing over a daylight savings boundry
        if (!date.isUTC && next.getTime() <= d.getTime()) {
            next = new LaterDate(d.getTime() + (inc + 7200) * SEC);
        }

        return next;
    },

    /**
     * Returns the end of the previous instance of the second value indicated.
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
            h.val(d),
            m.val(d) + (val >= s.val(d) ? -1 : 0),
            val,
        );
    },
};

export const second = s;

