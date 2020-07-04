/**
 * Day of Week Constraint (dw)
 * (c) 2013 Bill, BunKat LLC.
 *
 * Definition for a day of week constraint type.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */
import {IConstraint} from "./contraint";
import { date } from "../date/date";
import { D } from "./day";
import { Y } from "./year";
import { M } from "./month";
export const dayOfWeek: IConstraint = {
    /**
     * The name of this constraint.
     */
    name: 'day of week',

    /**
     * The rough amount of seconds between start and end for this constraint.
     * (doesn't need to be exact)
     */
    range: 86400,

    /**
     * The day of week value of the specified date.
     *
     * @param {Date} d: The date to calculate the value of
     */
    val: function (d) {
        return d.dw || (d.dw = date.getDay.call(d) + 1);
    },

    /**
     * Returns true if the val is valid for the date specified.
     *
     * @param {Date} d: The date to check the value on
     * @param {Integer} val: The value to validate
     */
    isValid: function (d, val) {
        return dw.val(d) === (val || 7);
    },

    /**
     * The minimum and maximum valid day of week values. Unlike the standard
     * Date object, Later day of week goes from 1 to 7.
     */
    extent: function () {
        return [1, 7];
    },

    /**
     * The start of the day of the specified date.
     *
     * @param {Date} d: The specified date
     */
    start: function (d) {
        return D.start(d);
    },

    /**
     * The end of the day of the specified date.
     *
     * @param {Date} d: The specified date
     */
    end: function (d) {
        return D.end(d);
    },

    /**
     * Returns the start of the next instance of the day of week value indicated.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    next: function (d, val) {
        val = val > 7 ? 1 : val || 7;

        return date.next(
            Y.val(d),
            M.val(d),
            D.val(d) + (val - dw.val(d)) + (val <= dw.val(d) ? 7 : 0),
        );
    },

    /**
     * Returns the end of the previous instance of the day of week value indicated.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    prev: function (d, val) {
        val = val > 7 ? 7 : val || 7;

        return date.prev(
            Y.val(d),
            M.val(d),
            D.val(d) + (val - dw.val(d)) + (val >= dw.val(d) ? -7 : 0),
        );
    },
};

export const d = dayOfWeek;
export const dw = dayOfWeek;
