export interface ILaterArray {
    next(val: number, values: number[], extent: number[]): number;
    nextInvalid(val: number, values: number[], extent: number[]): number | undefined;
    prev(val: number, values: number[], extent: number[]): number;
    prevInvalid(val: number, values: number[], extent: number[]): number | undefined;
    sort(arr: number[], zeroIsLast?: boolean): void;
}

export const array: ILaterArray = {
    next(val: number, values: number[], extent: number[]): number {
        let cur: number,
            zeroIsLargest = extent[0] !== 0,
            nextIdx = 0;

        for (let i = values.length - 1; i > -1; --i) {
            cur = values[i];

            if (cur === val) {
                return cur;
            }

            if (cur > val || (cur === 0 && zeroIsLargest && extent[1] > val)) {
                nextIdx = i;
                continue;
            }

            break;
        }

        return values[nextIdx];
    },
    nextInvalid(val: number, values: number[], extent: number[]): number | undefined {
        let min = extent[0],
            max = extent[1],
            len = values.length,
            zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0,
            next = val,
            i = values.indexOf(val),
            start = next;

        while (next === (values[i] || zeroVal)) {
            next++;
            if (next > max) {
                next = min;
            }

            i++;
            if (i === len) {
                i = 0;
            }

            if (next === start) {
                return undefined;
            }
        }

        return next;
    },
    prev(val: number, values: number[], extent: number[]): number {
        var cur,
            len = values.length,
            zeroIsLargest = extent[0] !== 0,
            prevIdx = len - 1;

        for (var i = 0; i < len; i++) {
            cur = values[i];

            if (cur === val) {
                return cur;
            }

            if (cur < val || (cur === 0 && zeroIsLargest && extent[1] < val)) {
                prevIdx = i;
                continue;
            }

            break;
        }

        return values[prevIdx];
    },
    prevInvalid(val: number, values: number[], extent: number[]): number | undefined {
        var min = extent[0],
            max = extent[1],
            len = values.length,
            zeroVal = values[len - 1] === 0 && min !== 0 ? max : 0,
            next = val,
            i = values.indexOf(val),
            start = next;

        while (next === (values[i] || zeroVal)) {
            next--;

            if (next < min) {
                next = max;
            }

            i--;
            if (i === -1) {
                i = len - 1;
            }

            if (next === start) {
                return undefined;
            }
        }

        return next;
    },
    sort(arr: number[], zeroIsLast: boolean = false): void {
        arr.sort(function (a, b) {
            return +a - +b;
        });

        if (zeroIsLast && arr[0] === 0) {
            arr.push(<number>arr.shift());
        }
    },
};
