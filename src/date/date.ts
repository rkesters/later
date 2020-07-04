import * as _ from 'lodash';
import * as lux from 'luxon';

import { IConstraint } from '../constraint/contraint';
import { day } from '../constraint/day';
import { SEC } from './constant';

export interface IConstraintDateStruct {
    day: number;
    D: number;
    dw: number;
    d: number;
    dayOfWeek: number;
    dayOfWeekCount: number;
    dc: number;
    dy: number;
    fd: number;
    h: number;
    m: number;
    M: number;
    s: number;
    t: number;
    wm: number;
    wy: number;
    Y: number;
    YStart: LaterDate;
    YEnd: LaterDate;
    wyExtent: [number, number];
    wyStart: LaterDate;
    wyEnd: LaterDate;
    wmStart: LaterDate;
    wmEnd: LaterDate;
    wmExtent: [number, number];
    sStart: LaterDate;
    sEnd: LaterDate;
    MStart: LaterDate;
    MEnd: LaterDate;
    mStart: LaterDate;
    mEnd: LaterDate;
    hStart: LaterDate;
    hEnd: LaterDate;
    dyExtent: [number, number];
    dcExtent: [number, number];
    dcStart: LaterDate;
    dcEnd: LaterDate;
    DExtent: [number, number];
    DStart: LaterDate;
    DEnd: LaterDate;
}
export type PIConstraintDateStruct = Partial<IConstraintDateStruct>;
export class LaterDate extends Date implements PIConstraintDateStruct {
    public static useLocalTime: boolean = false;
    private _isUTC: boolean;
    public get isUTC(): boolean {
        return this._isUTC;
    }

    public constructor();
    public constructor(value: number | string | Date);
    public constructor(
        year: number,
        month: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        ms?: number,
    );
    public constructor(
        year?: number | string | Date,
        month?: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        ms?: number,
    ) {
        if (LaterDate.useLocalTime) {
            year
                ? !_.isUndefined(month)
                    ? super(
                          <number>year,
                          month,
                          date ?? 1,
                          hours ?? 0,
                          minutes ?? 0,
                          seconds ?? 0,
                          ms ?? 0,
                      )
                    : _.isString(year)
                    ? super(
                          lux.DateTime.fromISO(<string>year)
                              .toLocal()
                              .toISO(),
                      )
                    : super(year)
                : super();
        } else {
            year
                ? !_.isUndefined(month)
                    ? super(
                          Date.UTC(
                              <number>year,
                              month,
                              date ?? 1,
                              hours ?? 0,
                              minutes ?? 0,
                              seconds ?? 0,
                              ms ?? 0,
                          ),
                      )
                    : _.isString(year)
                    ? super(
                          lux.DateTime.fromISO(<string>year)
                              .toUTC()
                              .toISO(),
                      )
                    : super(year)
                : super();
        }

        this._isUTC = !LaterDate.useLocalTime;
    }

    day?: number;
    D?: number;
    dw?: number;
    dv?: number;
    dayOfWeek?: number;
    d?: number;
    dayOfWeekCount?: number;
    dc?: number;
    dy?: number;
    fd?: number;
    h?: number;
    m?: number;
    M?: number;
    s?: number;
    t?: number;
    wm?: number;
    wy?: number;
    Y?: number;
    YStart?: LaterDate;
    YEnd?: LaterDate;
    wyExtent?: [number, number];
    wyStart?: LaterDate;
    wyEnd?: LaterDate;
    wmStart?: LaterDate;
    wmEnd?: LaterDate;
    wmExtent?: [number, number];
    sStart?: LaterDate;
    sEnd?: LaterDate;
    MStart?: LaterDate;
    MEnd?: LaterDate;
    mStart?: LaterDate;
    mEnd?: LaterDate;
    hStart?: LaterDate;
    hEnd?: LaterDate;
    dyExtent?: [number, number];
    dcExtent?: [number, number];
    dcStart?: LaterDate;
    dcEnd?: LaterDate;
    DExtent?: [number, number];
    DStart?: LaterDate;
    DEnd?: LaterDate;

    public next(
        Y: number,
        M?: number,
        D?: number ,
        h?: number ,
        m?: number ,
        s?: number ,
    ): LaterDate {
        return date.build(Y, M ? M - 1 : 0, D, h, m, s);
    }
    public prev(Y: number, M?: number, D?: number, h?: number, m?: number, s?: number): LaterDate {
        const len = arguments.length;
        M = M ? M - 1 : 11;
        D = len < 3 ? day.extent(date.next(Y, M + 1))[1] : D;
        h = len < 4 ? 23 : h;
        m = len < 5 ? 59 : m;
        s = len < 6 ? 59 : s;

        const r = date.build(Y, M, D, h, m, s);

        return r;
    }
    public nextRollover(
        d: LaterDate,
        val: number,
        constraint: IConstraint,
        period: IConstraint,
    ): LaterDate {
        const cur: number = constraint.val(d),
            max: number = constraint.extent(d)[1];

        return (val || max) <= cur || val > max
            ? new LaterDate(period.end(d).getTime() + SEC)
            : period.start(d);
    }

    public prevRollover(
        d: LaterDate,
        val: number,
        constraint: IConstraint,
        period: IConstraint,
    ): LaterDate {
        const cur = constraint.val(d);

        return val >= cur || !val
            ? period.start(period.prev(d, period.val(d) - 1))
            : period.start(d);
    }
    public build(Y: number, M: number, D?: number, h?: number, m?: number, s?: number): LaterDate {
        return LaterDate.useLocalTime
            ? new LaterDate(Y, M, D, h, m, s)
            : new LaterDate(Date.UTC(Y, M, D ?? 1, h ?? 0, m ?? 0, s ?? 0));
    }
    public getYear() {
        return LaterDate.useLocalTime ? super.getFullYear() : super.getUTCFullYear();
    }
    public getFullYear() {
        return LaterDate.useLocalTime ? super.getFullYear() : super.getUTCFullYear();
    }
    public getMonth() {
        return LaterDate.useLocalTime ? super.getMonth() : super.getUTCMonth();
    }
    public getDate() {
        return LaterDate.useLocalTime ? super.getDate() : super.getUTCDate();
    }
    public getDay() {
        return LaterDate.useLocalTime ? super.getDay() : super.getUTCDay();
    }
    public getHour() {
        return LaterDate.useLocalTime ? super.getHours() : super.getUTCHours();
    }
    public getHours() {
        return LaterDate.useLocalTime ? super.getHours() : super.getUTCHours();
    }
    public getMin() {
        return LaterDate.useLocalTime ? super.getMinutes() : super.getUTCMinutes();
    }
    public getMinutes() {
        return LaterDate.useLocalTime ? super.getMinutes() : super.getUTCMinutes();
    }
    public getSec() {
        return LaterDate.useLocalTime ? super.getSeconds() : super.getUTCSeconds();
    }
    public getSeconds() {
        return LaterDate.useLocalTime ? super.getSeconds() : super.getUTCSeconds();
    }

    public toString() {
        return LaterDate.useLocalTime ? super.toString() : super.toUTCString();
    }

    public static timezone(useLocalTime: boolean) {
        LaterDate.useLocalTime = useLocalTime;
    }

    public UTC() {
        LaterDate.timezone(false);
        if (!this.isUTC) {
            const a = new LaterDate(this.toISOString());
            a._isUTC = true;
            return a;
        }
        return this;
    }

    public localTime() {
        LaterDate.timezone(true);
        if (this.isUTC) {
            const a = new LaterDate(this.toISOString());
            a._isUTC = false;
            return a;
        }
        return this;
    }

    public static updateForTZ(d: LaterDate) {
        if (d.isUTC && !LaterDate.useLocalTime) {
            return d;
        }

        if (!d.isUTC && !LaterDate.useLocalTime) {
            const dd = new Date(d.toUTCString());
            return new LaterDate(dd);
        }

        if (d.isUTC && LaterDate.useLocalTime) {
            const dd = new Date(d.toISOString());
            return new LaterDate(dd);
        }
    }

    public static fromLocal(): LaterDate;
    public static fromLocal(value: number | string | Date): LaterDate;
    public static fromLocal(
        year: number,
        month: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        ms?: number,
    ): LaterDate;
    public static fromLocal(
        year?: number | string | Date,
        month?: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        ms?: number,
    ): LaterDate {
        const d: Date = year
            ? !_.isNil(month)
                ? new Date(
                      <number>year,
                      month,
                      date ?? 1,
                      hours ?? 0,
                      minutes ?? 0,
                      seconds ?? 0,
                      ms ?? 0,
                  )
                : _.isString(year)
                ? new Date(<string>year)
                : <Date>year
            : new Date();

        const r = LaterDate.useLocalTime
            ? new LaterDate(d)
            : new LaterDate(
                  d.getUTCFullYear(),
                  d.getUTCMonth(),
                  d.getUTCDate(),
                  d.getUTCHours(),
                  d.getUTCMinutes(),
                  d.getUTCSeconds(),
                  d.getUTCMilliseconds(),
              );
        return r;
    }
}

LaterDate.timezone(false);

export const date = new LaterDate();

export const fromLocal = LaterDate.fromLocal;
