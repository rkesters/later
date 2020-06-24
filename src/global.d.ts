declare interface ILaterArray {
    next<T extends number>(val: T, values: T[], extent: T[]): T;
    nextInvalid<T_1 extends number>(val: T_1, values: T_1[], extent: T_1[]): T_1 | undefined;
    prev<T_2 extends number>(val: T_2, values: T_2[], extent: T_2[]): T_2;
    prevInvalid<T_3 extends number>(val: T_3, values: T_3[], extent: T_3[]): T_3 | undefined;
    sort<T_4 extends number>(arr: T_4[], zeroIsLast: boolean): void;
}

declare interface IConstraint<T = LaterDate> {
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

declare interface IRecur {
    /**
     * Set of constraints that must be met for an occurrence to be valid.
     *
     * @api public
     */
    schedules: LaterDate[];
    /**
     * Set of exceptions that must not be met for an occurrence to be
     * valid.
     *
     * @api public
     */
    exceptions: LaterDate[];
    /**
     * Specifies the specific instances of a time period that are valid.
     * Must be followed by the desired time period (minute(), hour(),
     * etc). For example, to specify a schedule for the 5th and 25th
     * minute of every hour:
     *
     * recur().on(5, 25).minute();
     *
     * @param {Int} args: One or more valid instances
     * @api public
     */
    on: (...args: (string | number)[]) => any;
    /**
     * Specifies the recurring interval of a time period that are valid.
     * Must be followed by the desired time period (minute(), hour(),
     * etc). For example, to specify a schedule for every 4 hours in the
     * day:
     *
     * recur().every(4).hour();
     *
     * @param {Int} x: Recurring interval
     * @api public
     */
    every: (x: string) => any;
    /**
     * Specifies the minimum valid value.  For example, to specify a schedule
     * that is valid for all hours after four:
     *
     * recur().after(4).hour();
     *
     * @param {Int} x: Recurring interval
     * @api public
     */
    after: (x: string) => any;
    /**
     * Specifies the maximum valid value.  For example, to specify a schedule
     * that is valid for all hours before four:
     *
     * recur().before(4).hour();
     *
     * @param {Int} x: Recurring interval
     * @api public
     */
    before: (x: string) => any;
    /**
     * Specifies that the first instance of a time period is valid. Must
     * be followed by the desired time period (minute(), hour(), etc).
     * For example, to specify a schedule for the first day of every
     * month:
     *
     * recur().first().dayOfMonth();
     *
     * @api public
     */
    first: () => any;
    /**
     * Specifies that the last instance of a time period is valid. Must
     * be followed by the desired time period (minute(), hour(), etc).
     * For example, to specify a schedule for the last day of every year:
     *
     * recur().last().dayOfYear();
     *
     * @api public
     */
    last: () => any;
    /**
     * Specifies a specific time that is valid. Time must be specified in
     * hh:mm:ss format using 24 hour time. For example, to specify
     * a schedule for 8:30 pm every day:
     *
     * recur().time('20:30:00');
     *
     * @param {String} time: Time in hh:mm:ss 24-hour format
     * @api public
     */
    time: () => any;
    /**
     * Seconds time period, denotes seconds within each minute.
     * Minimum value is 0, maximum value is 59. Specify 59 for last.
     *
     * recur().on(5, 15, 25).second();
     *
     * @api public
     */
    second: () => any;
    /**
     * Minutes time period, denotes minutes within each hour.
     * Minimum value is 0, maximum value is 59. Specify 59 for last.
     *
     * recur().on(5, 15, 25).minute();
     *
     * @api public
     */
    minute: () => any;
    /**
     * Hours time period, denotes hours within each day.
     * Minimum value is 0, maximum value is 23. Specify 23 for last.
     *
     * recur().on(5, 15, 25).hour();
     *
     * @api public
     */
    hour: () => any;
    /**
     * Days of month time period, denotes number of days within a month.
     * Minimum value is 1, maximum value is 31.  Specify 0 for last.
     *
     * recur().every(2).dayOfMonth();
     *
     * @api public
     */
    dayOfMonth: () => any;
    /**
     * Days of week time period, denotes the days within a week.
     * Minimum value is 1, maximum value is 7.  Specify 0 for last.
     * 1 - Sunday
     * 2 - Monday
     * 3 - Tuesday
     * 4 - Wednesday
     * 5 - Thursday
     * 6 - Friday
     * 7 - Saturday
     *
     * recur().on(1).dayOfWeek();
     *
     * @api public
     */
    dayOfWeek: () => any;
    /**
     * Short hand for on(1,7).dayOfWeek()
     *
     * @api public
     */
    onWeekend: () => any;
    /**
     * Short hand for on(2,3,4,5,6).dayOfWeek()
     *
     * @api public
     */
    onWeekday: () => any;
    /**
     * Days of week count time period, denotes the number of times a
     * particular day has occurred within a month.  Used to specify
     * things like second Tuesday, or third Friday in a month.
     * Minimum value is 1, maximum value is 5.  Specify 0 for last.
     * 1 - First occurrence
     * 2 - Second occurrence
     * 3 - Third occurrence
     * 4 - Fourth occurrence
     * 5 - Fifth occurrence
     * 0 - Last occurrence
     *
     * recur().on(1).dayOfWeek().on(1).dayOfWeekCount();
     *
     * @api public
     */
    dayOfWeekCount: () => any;
    /**
     * Days of year time period, denotes number of days within a year.
     * Minimum value is 1, maximum value is 366.  Specify 0 for last.
     *
     * recur().every(2).dayOfYear();
     *
     * @api public
     */
    dayOfYear: () => any;
    /**
     * Weeks of month time period, denotes number of weeks within a
     * month. The first week is the week that includes the 1st of the
     * month. Subsequent weeks start on Sunday.
     * Minimum value is 1, maximum value is 5.  Specify 0 for last.
     * February 2nd,  2012 - Week 1
     * February 5th,  2012 - Week 2
     * February 12th, 2012 - Week 3
     * February 19th, 2012 - Week 4
     * February 26th, 2012 - Week 5 (or 0)
     *
     * recur().on(2).weekOfMonth();
     *
     * @api public
     */
    weekOfMonth: () => any;
    /**
     * Weeks of year time period, denotes the ISO 8601 week date. For
     * more information see: http://en.wikipedia.org/wiki/ISO_week_date.
     * Minimum value is 1, maximum value is 53.  Specify 0 for last.
     *
     * recur().every(2).weekOfYear();
     *
     * @api public
     */
    weekOfYear: () => any;
    /**
     * Month time period, denotes the months within a year.
     * Minimum value is 1, maximum value is 12.  Specify 0 for last.
     * 1 - January
     * 2 - February
     * 3 - March
     * 4 - April
     * 5 - May
     * 6 - June
     * 7 - July
     * 8 - August
     * 9 - September
     * 10 - October
     * 11 - November
     * 12 - December
     *
     * recur().on(1).dayOfWeek();
     *
     * @api public
     */
    month: () => any;
    /**
     * Year time period, denotes the four digit year.
     * Minimum value is 1970, maximum value is Jan 1, 2100 (arbitrary)
     *
     * recur().on(2011, 2012, 2013).year();
     *
     * @api public
     */
    year: () => any;
    /**
     * Full date period, denotes a full date and time.
     * Minimum value is Jan 1, 1970, maximum value is Jan 1, 2100 (arbitrary)
     *
     * recur().on(new Date(2013, 3, 2, 10, 30, 0)).fullDate();
     *
     * @api public
     */
    fullDate: () => any;
    /**
     * Custom modifier.
     *
     * recur().on(2011, 2012, 2013).custom('partOfDay');
     *
     * @api public
     */
    customModifier: (id: string, ...vals: number[]) => any;
    /**
     * Custom time period.
     *
     * recur().on(2011, 2012, 2013).customPeriod('partOfDay');
     *
     * @api public
     */
    customPeriod: (id: keyof ILaterGlobalIndex) => any;
    /**
     * Modifies a recurring interval (specified using every) to start
     * at a given offset.  To create a schedule for every 5 minutes
     * starting on the 6th minute - making minutes 6, 11, 16, etc valid:
     *
     * recur().every(5).minute().startingOn(6);
     *
     * @param {Int} start: The desired starting offset
     * @api public
     */
    startingOn: (start: number) => any;
    /**
     * Modifies a recurring interval (specified using every) to start
     * and stop at specified times.  To create a schedule for every
     * 5 minutes starting on the 6th minute and ending on the 11th
     * minute - making minutes 6 and 11 valid:
     *
     * recur().every(5).minute().between(6, 11);
     *
     * @param {Int} start: The desired starting offset
     * @param {Int} end: The last valid value
     * @api public
     */
    between: (start: number, end: number) => any;
    /**
     * Creates a composite schedule.  With a composite schedule, a valid
     * occurrence of any of the component schedules is considered a valid
     * value for the composite schedule (e.g. they are OR'ed together).
     * To create a schedule for every 5 minutes on Mondays and every 10
     * minutes on Tuesdays:
     *
     * recur().every(5).minutes().on(1).dayOfWeek().and().every(10)
     *    .minutes().on(2).dayOfWeek();
     *
     * @api public
     */
    and: () => any;
    /**
     * Creates exceptions to a schedule. Any valid occurrence of the
     * exception schedule (which may also be composite schedules) is
     * considered a invalid schedule occurrence. Everything that follows
     * except will be treated as an exception schedule.  To create a
     * schedule for 8:00 am every Tuesday except for patch Tuesday
     * (second Tuesday each month):
     *
     * recur().at('08:00:00').on(2).dayOfWeek().except()
     *    .dayOfWeekCount(1);
     *
     * @api public
     */
    except: () => any;
}
declare interface IParse {
    recur(): IRecur;
    cron(expr: string, hasSeconds: boolean): ISchedule;
    text(
        str: string,
    ): {
        schedules: any;
        exceptions: any;
        error: number;
    };
}

declare type PIConstraintDateStrcut = Partial<IConstraintDateStruct>;
declare class LaterDate extends Date implements PIConstraintDateStrcut {
    private static useLocalTime;
    get isUTC(): boolean;
    day?: number;
    D?: number;
    dw?: number;
    d?: number;
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
    next(Y: number, M?: number, D?: number, h?: number, m?: number, s?: number): LaterDate;
    prev(Y: number, M?: number, D?: number, h?: number, m?: number, s?: number): LaterDate;
    nextRollover(
        d: LaterDate,
        val: number,
        constraint: IConstraint,
        period: IConstraint,
    ): LaterDate;
    prevRollover(
        d: LaterDate,
        val: number,
        constraint: IConstraint,
        period: IConstraint,
    ): LaterDate;
    build(Y: number, M: number, D?: number, h?: number, m?: number, s?: number): LaterDate;
    getYear(): number;
    getFullYear(): number;
    getMonth(): number;
    getDate(): number;
    getDay(): number;
    getHour(): number;
    getHours(): number;
    getMin(): number;
    getMinutes(): number;
    getSec(): number;
    getSeconds(): number;
    static timezone(useLocalTime: boolean): void;
}

declare interface IConstraintDateStruct {
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

declare interface IScheduleDef {
    day: number[];
    D: number[];
    dw: number[];
    d: number[];
    dayOfWeek: number[];
    dayOfWeekCount: number[];
    dc: number[];
    dy: number[];
    fd: number[];
    h: number[];
    m: number[];
    M: number[];
    s: number[];
    t: number[];
    wm: number[];
    wy: number[];
    Y: number[];
    /* YStart: LaterDate;
    YEnd: LaterDate;
    wyExtent: [number, number];
    wyStart: LaterDate;
    wyEnd: LaterDate;
    wmStart: LaterDate;
    wmEnd: LaterDate;
    wmExtent: [number, number];
    sStart: number;
    sEnd: number;
    MStart: number;
    MEnd: number;
    mStart: number;
    mEnd: number;
    hStart: LaterDate;
    hEnd: LaterDate;
    dyExtent: [number, number];
    dcExtent: [number, number];
    dcStart: number;
    dcEnd: number;
    DExtent: [number, number];
    DStart: LaterDate;
    DEnd: LaterDate;
    */
}

declare interface IScheduleResult {
    /**
     * Returns true if d is a valid occurrence of the current schedule.
     *
     * @param {Date} d: The date to check
     */
    isValid: (d: LaterDate) => boolean;
    /**
     * Finds the next valid instance or instances of the current schedule,
     * optionally between a specified start and end date. Start date is
     * Date.now() by default, end date is unspecified. Start date must be
     * smaller than end date.
     *
     * @param {Integer} count: The number of instances to return
     * @param {Date} startDate: The earliest a valid instance can occur
     * @param {Date} endDate: The latest a valid instance can occur
     */
    next: (
        count: number,
        startDate: LaterDate,
        endDate?: LaterDate,
    ) => Date | (Date | (Date | undefined)[] | undefined)[] | undefined;
    /**
     * Finds the previous valid instance or instances of the current schedule,
     * optionally between a specified start and end date. Start date is
     * Date.now() by default, end date is unspecified. Start date must be
     * greater than end date.
     *
     * @param {Integer} count: The number of instances to return
     * @param {Date} startDate: The earliest a valid instance can occur
     * @param {Date} endDate: The latest a valid instance can occur
     */
    prev: (
        count: number,
        startDate: LaterDate,
        endDate: LaterDate,
    ) => Date | (Date | (Date | undefined)[] | undefined)[] | undefined;
    /**
     * Finds the next valid range or ranges of the current schedule,
     * optionally between a specified start and end date. Start date is
     * Date.now() by default, end date is unspecified. Start date must be
     * greater than end date.
     *
     * @param {Integer} count: The number of ranges to return
     * @param {Date} startDate: The earliest a valid range can occur
     * @param {Date} endDate: The latest a valid range can occur
     */
    nextRange: (
        count: number,
        startDate: LaterDate,
        endDate: LaterDate,
    ) => Date | (Date | (Date | undefined)[] | undefined)[] | undefined;
    /**
     * Finds the previous valid range or ranges of the current schedule,
     * optionally between a specified start and end date. Start date is
     * Date.now() by default, end date is unspecified. Start date must be
     * greater than end date.
     *
     * @param {Integer} count: The number of ranges to return
     * @param {Date} startDate: The earliest a valid range can occur
     * @param {Date} endDate: The latest a valid range can occur
     */
    prevRange: (
        count: number,
        startDate: LaterDate,
        endDate: LaterDate,
    ) => Date | (Date | (Date | undefined)[] | undefined)[] | undefined;
}

declare type DIRECTION = 'next' | 'prev';
declare interface IModifier {
    after(constraint: IConstraint, values: any[]): IConstraint;
    a(constraint: IConstraint, values: any[]): IConstraint;
    before(constraint: IConstraint, values: any[]): IConstraint;
    b(constraint: IConstraint, values: any[]): IConstraint;
}
declare interface ICompiledSchedule {
    /**
     * Calculates the start of the next valid occurrence of a particular schedule
     * that occurs on or after the specified start time.
     *
     * @param {String} dir: Direction to search in ('next' or 'prev')
     * @param {Date} startDate: The first possible valid occurrence
     */
    start: (dir: 'next' | 'prev', startDate: LaterDate) => LaterDate;
    /**
     * Given a valid start time, finds the next schedule that is invalid.
     * Useful for finding the end of a valid time range.
     *
     * @param {Date} startDate: The first possible valid occurrence
     */
    end: (dir: 'next' | 'prev', startDate: LaterDate) => LaterDate;
    /**
     * Ticks the date by the minimum constraint in this schedule
     *
     * @param {String} dir: Direction to tick in ('next' or 'prev')
     * @param {Date} date: The start date to tick from
     */
    tick: (dir: 'next' | 'prev', date: LaterDate) => LaterDate;
    /**
     * Ticks the date to the start of the minimum constraint
     *
     * @param {Date} date: The start date to tick from
     */
    tickStart: (date: LaterDate) => LaterDate;
}
declare interface ISchedule {
    schedules: IScheduleDef[];
    exceptions: IScheduleDef[];
}
declare type CompileFn = (scheduleDef: IScheduleDef) => ICompiledSchedule;

declare interface LaterSetTimeoutFnResult {
    isDone: () => boolean;
    /**
     * Clears the timeout.
     */
    clear: () => void;
}
declare type LaterSetTimeoutFn = (fn: () => void, sched: ISchedule) => LaterSetTimeoutFnResult;

declare interface ILaterGlobal {
    parse: IParse;
    array: ILaterArray;
    modifier: IModifier;

    setTimeout: LaterSetTimeoutFn;
    setInterval: LaterSetTimeoutFn;
    schedule(scheduled: ISchedule): IScheduleResult;
    compile: CompileFn;
    build(
        year: number,
        month: number,
        date?: number,
        hours?: number,
        minutes?: number,
        seconds?: number,
        ms?: number,
    ): LaterDate;

    SEC: number;
    MIN: number;
    HOUR: number;
    DAY: number;
    WEEK: number;
    DAYS_IN_MONTH: number[];
    NEVER: LaterDate;
    date: LaterDate;

    day: IConstraint;
    D: IConstraint;
    dw: IConstraint;
    d: IConstraint;
    dayOfWeek: IConstraint;
    dayOfWeekCount: IConstraint;
    dc: IConstraint;
    dy: IConstraint;
    fd: IConstraint;
    h: IConstraint;
    hour: IConstraint;
    m: IConstraint;
    minute: IConstraint;
    M: IConstraint;
    month: IConstraint;
    s: IConstraint;
    second: IConstraint;
    t: IConstraint;
    time: IConstraint;
    wm: IConstraint;
    weekOfMonth: IConstraint;
    wy: IConstraint;
    weekOfYear: IConstraint;
    Y: IConstraint;
    dayOfYear: IConstraint;
    fullDate: IConstraint;
    year: IConstraint;
}

declare type ILaterGlobalIndex = { [k in keyof ILaterGlobal]: ILaterGlobal[k] };
declare const later: ILaterGlobalIndex;
