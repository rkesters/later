export const array: ILaterArray = {
    next<T extends number>(val: T, values: T[], extent: T[]) {
        let cur: T,
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
    nextInvalid<T extends number>(val: T, values: T[], extent: T[]) {
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
    prev<T extends number>(val: T, values: T[], extent: T[]) {
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
    prevInvalid<T extends number>(val: T, values: T[], extent: T[]) {
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
    sort<T extends number>(arr: T[], zeroIsLast: boolean) {
        arr.sort(function (a, b) {
            return +a - +b;
        });

        if (zeroIsLast && arr[0] === 0) {
            arr.push(<T>arr.shift());
        }
    },
};
later.array = array;
