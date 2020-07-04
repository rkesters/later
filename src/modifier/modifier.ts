import { LaterDate } from '../date/date';
import {IConstraint} from "../constraint/contraint";


export interface IModifier {
    after(constraint: IConstraint, values: any[]): IConstraint;
    a(constraint: IConstraint, values: any[]): IConstraint;
    before(constraint: IConstraint, values: any[]): IConstraint;
    b(constraint: IConstraint, values: any[]): IConstraint;
}

export function after(constraint: IConstraint, values: any[]): IConstraint {
    var value = values[0];

    return {
        /**
         * Returns the name of the constraint with the 'after' modifier.
         */
        name: 'after ' + constraint.name,

        /**
         * Pass through to the constraint.
         */
        range: (constraint.extent(new LaterDate())[1] - value) * constraint.range,

        /**
         * The value of the specified date. Returns value for any constraint val
         * that is greater than or equal to value.
         *
         * @param {Date} d: The date to calculate the value of
         */
        val: constraint.val,

        /**
         * Returns true if the val is valid for the date specified.
         *
         * @param {Date} d: The date to check the value on
         * @param {Integer} val: The value to validate
         */
        isValid: function (d: LaterDate, val: number) {
            return this.val(d) >= value;
        },

        /**
         * Pass through to the constraint.
         */
        extent: constraint.extent,

        /**
         * Pass through to the constraint.
         */
        start: constraint.start,

        /**
         * Pass through to the constraint.
         */
        end: constraint.end,

        /**
         * Pass through to the constraint.
         */
        next: function (startDate: LaterDate, val: number) {
            if (val != value) val = constraint.extent(startDate)[0];
            return constraint.next(startDate, val);
        },

        /**
         * Pass through to the constraint.
         */
        prev: function (startDate: LaterDate, val: number) {
            val = val === value ? constraint.extent(startDate)[1] : value - 1;
            return constraint.prev(startDate, val);
        },
    };
}

export function before(constraint: IConstraint, values: any[]): IConstraint {
    var value = values[values.length - 1];

    return {
        /**
         * Returns the name of the constraint with the 'before' modifier.
         */
        name: 'before ' + constraint.name,

        /**
         * Pass through to the constraint.
         */
        range: constraint.range * (value - 1),

        /**
         * The value of the specified date. Returns value for any constraint val
         * that is less than or equal to value.
         *
         * @param {Date} d: The date to calculate the value of
         */
        val: constraint.val,

        /**
         * Returns true if the val is valid for the date specified.
         *
         * @param {Date} d: The date to check the value on
         * @param {Integer} val: The value to validate
         */
        isValid: function (d, val) {
            return this.val(d) < value;
        },

        /**
         * Pass through to the constraint.
         */
        extent: constraint.extent,

        /**
         * Pass through to the constraint.
         */
        start: constraint.start,

        /**
         * Jump to the end of the range.
         */
        end: constraint.end,

        /**
         * Pass through to the constraint.
         */
        next: function (startDate, val) {
            val = val === value ? constraint.extent(startDate)[0] : value;
            return constraint.next(startDate, val);
        },

        /**
         * Pass through to the constraint.
         */
        prev: function (startDate, val) {
            val = val === value ? value - 1 : constraint.extent(startDate)[1];
            return constraint.prev(startDate, val);
        },
    };
}

export const modifier: IModifier = {
    after,
    a: after,
    before,
    b: before
};

