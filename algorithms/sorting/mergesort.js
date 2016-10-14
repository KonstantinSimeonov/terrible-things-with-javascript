'use strict';

const mergesort = (function () {
    let sorted;

    function merge(from, middle, to, array) {
        let i = from,
            j = middle;

        while (i < middle && j < to) {
            if (array[i] < array[j]) {
                sorted[from] = array[i];
                i += 1;
            } else {
                sorted[from] = array[j];
                j += 1;
            }

            from += 1;
        }

        while (i < middle) {
            sorted[from] = array[i];
            i += 1;
            from += 1;
        }

        while (j < to) {
            sorted[from] = array[j];
            j += 1;
            from += 1;
        }
    }

    function mergesort(from, to, array) {

        if (from >= (to - 1)) {
            return;
        }

        const middle = ((to - from) >> 1) + from;

        mergesort(from, middle, array);
        mergesort(middle, to, array);

        merge(from, middle, to, array);

        while (from < to) {
            array[from] = sorted[from];
            from += 1;
        }
    }

    return function (array) {
        sorted = [];

        mergesort(0, array.length, array);

        return array;
    }
} ());

const test = [0, 1, 100, -3, 2, 6, -2, -1, 0, 33, -7, 68, 19];
mergesort(test);

console.log(test);

const test2 = [0, 1, 100, -37, 27, 67, -27, -21, 10, 323, -7, 68, 19];
mergesort(test2);

console.log(test2);