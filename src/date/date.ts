
type PIConstraintDateStrcut = Partial<IConstraintDateStruct>;
export class LaterDate extends Date implements PIConstraintDateStrcut{
    private static useLocalTime: boolean = false;
    public get isUTC(): boolean {
        return !LaterDate.useLocalTime;
    }

    /*public constructor();
    public constructor(value: number | string);
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
        year?: number | string,
        month?: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        ms?: number,
    ) {
        year
            ? month
                ? super(<number>year, month, date, hours, minutes, seconds, ms)
                : super(<string>year)
            : super();
    }*/

    day?: number;
    D?: number;
    dw?: number;
    dv?: number;
    dayOfWeek?: number;
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
        M: number = 1,
        D: number = 1,
        h: number = 0,
        m: number = 0,
        s: number = 0,
    ): LaterDate {
        return later.date.build(Y, M, D, h, m, s);
    }
    public prev(
        Y: number,
        M: number = 11,
        D?: number,
        h: number = 23,
        m: number = 59,
        s: number = 59,
    ): LaterDate {
        const len = arguments.length;
        M = len < 2 ? 11 : M - 1;
        D = len < 3 ? later.D.extent(later.date.next(Y, M + 1))[1] : D;
        h = len < 4 ? 23 : h;
        m = len < 5 ? 59 : m;
        s = len < 6 ? 59 : s;

        return later.date.build(Y, M, D, h, m, s);
    }
    public nextRollover(d: LaterDate, val: number, constraint: IConstraint, period: IConstraint): LaterDate {
        const cur: number = constraint.val(d),
            max: number = constraint.extent(d)[1];

        return (val || max) <= cur || val > max
            ? new LaterDate(period.end(d).getTime() + later.SEC)
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
            : new LaterDate(Date.UTC(Y, M, D, h, m, s));
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

    public static timezone(useLocalTime: boolean) {
        LaterDate.useLocalTime = useLocalTime;
    }
}



LaterDate.timezone(false);

later.date = new LaterDate();
