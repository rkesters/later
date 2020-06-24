import { LaterDate } from "../date/date";

export interface IConstraint<T = LaterDate> {
    /**
     * The name of this constraint.
     */
    name: string;
    /**
     * The rough amount of seconds between start and end for this constraint.
     * (doesn't need to be exact)
     */
    range: number;
    /**
     * The day value of the specified date.
     *
     * @param {Date} d: The date to calculate the value of
     */
    val: (d: T) => number;
    /**
     * Returns true if the val is valid for the date specified.
     *
     * @param {Date} d: The date to check the value on
     * @param {Integer} val: The value to validate
     */
    isValid: (d: T, val: number) => boolean;
    /**
     * The minimum and maximum valid day values of the month specified.
     * Zero to specify the last day of the month.
     *
     * @param {Date} d: The date indicating the month to find the extent of
     */
    extent: (d: T) => [number, number];
    /**
     * The start of the day of the specified date.
     *
     * @param {Date} d: The specified date
     */
    start: (d: T) => LaterDate;
    /**
     * The end of the day of the specified date.
     *
     * @param {Date} d: The specified date
     */
    end: (d: T) => LaterDate;
    /**
     * Returns the start of the next instance of the day value indicated. Returns
     * the first day of the next month if val is greater than the number of
     * days in the following month.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    next: (d: T, val: number) => LaterDate;
    /**
     * Returns the end of the previous instance of the day value indicated. Returns
     * the last day in the previous month if val is greater than the number of days
     * in the previous month.
     *
     * @param {Date} d: The starting date
     * @param {int} val: The desired value, must be within extent
     */
    prev: (d: T, val: number) => LaterDate;
}
