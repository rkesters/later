/**
 * Date Constants
 * (c) 2013 Bill, BunKat LLC.
 *
 * Useful constants for dealing with time conversions.
 *
 * Later is freely distributable under the MIT license.
 * For all details and documentation:
 *     http://github.com/bunkat/later
 */

import { LaterDate } from './date';

// Time to milliseconds conversion
export const SEC = 1000;
export const MIN = SEC * 60;
export const HOUR = MIN * 60;
export const DAY = HOUR * 24;
export const WEEK = DAY * 7;

// Array of days in each month, must be corrected for leap years
export const DAYS_IN_MONTH = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

// constant for specifying that a schedule can never occur
export const NEVER = new LaterDate(0);
