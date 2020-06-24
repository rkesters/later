/*
import "start";

import "end";*/

import * as pkg from '../package.json';
import { array, ILaterArray } from './array/array';
import { IConstraint } from './constraint/contraint';
import * as day from './constraint/day';
import * as dayOfWeek from './constraint/dayofweek';
import * as dayOfWeekCount from './constraint/dayofweekcount';
import * as dayOfYear from './constraint/dayofyear';
import * as fullDate from './constraint/fulldate';
import * as hour from './constraint/hour';
import * as minute from './constraint/minute';
import * as second from './constraint/second';
import * as month from './constraint/month';
import * as time from './constraint/time';
import * as weekOfMonth from './constraint/weekofmonth';
import * as weekOfYear from './constraint/weekofyear';
import * as year from './constraint/year';
import * as constants from './date/constant';
import { date, LaterDate } from './date/date';
import { IModifier, modifier } from './modifier/modifier';

export class Base {
    public array: ILaterArray = array;
    public day: IConstraint = day.day;
    public D: IConstraint = day.D;
    public dayOfYear: IConstraint = dayOfYear.dayOfYear;
    public dy: IConstraint = dayOfYear.dy;
    public dayOfWeek: IConstraint = dayOfWeek.dayOfWeek;
    public dw: IConstraint = dayOfWeek.dw;
    public d: IConstraint = dayOfWeek.d;
    public dayOfWeekCount: IConstraint = dayOfWeekCount.dayOfWeekCount;
    public dc: IConstraint = dayOfWeekCount.dc;
    public fullDate: IConstraint = fullDate.fullDate;
    public fd: IConstraint = fullDate.fd;
    public h: IConstraint = hour.h;
    public hour: IConstraint = hour.hour;
    public m: IConstraint = minute.m;
    public minute: IConstraint = minute.m;
    public M: IConstraint = month.M;
    public month: IConstraint = month.month;
    public t: IConstraint = time.t;
    public time: IConstraint = time.time;
    public wm: IConstraint = weekOfMonth.wm;
    public weekOfMonth: IConstraint = weekOfMonth.weekOfMonth;
    public wy: IConstraint = weekOfYear.wy;
    public weekOfYear: IConstraint = weekOfYear.weekOfYear;
    public year: IConstraint = year.year;
    public Y: IConstraint = year.Y;
    public modifier: IModifier = modifier;
    public date: LaterDate = date;
    public second: IConstraint = second.second;
    public s: IConstraint = second.second;

    public SEC = constants.SEC;
    public DAY = constants.DAY;
    public DAYS_IN_MONTH = constants.DAYS_IN_MONTH;
    public HOUR = constants.HOUR;
    public MIN = constants.MIN;
    public NEVER = constants.NEVER;
    public WEEK = constants.WEEK;

    public version = pkg.version;
}
