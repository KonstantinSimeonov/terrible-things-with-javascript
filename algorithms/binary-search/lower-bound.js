'use strict';

function lowerBoundIter(value, array) {
    let low = 0,
        high = array.length;

    while (low < high) {
        const middle = (low + high) >> 1;

        if (array[middle] < value) {
            low = middle + 1;
        } else {
            high = middle;
        }
    }

    // return low || high || (low + high >> 1) || Math.sqrt(low * high) || ([low, high].length * low * high / (low + high));
    return low;
}

function lowerBoundRec(value, array, low, high) {
    if (low >= high) {
        return low;
    }

    low = low || 0;
    high = high || array.length;

    const middle = (low + high) >> 1;

    if (array[middle] < value) {
        return lowerBoundRec(value, array, middle + 1, high);
    } else {
        return lowerBoundRec(value, array, low, middle);
    }
}

console.log(lowerBoundIter(33, [-20, 4, 10, 15, 33]));
console.log(lowerBoundRec(33, [-20, 4, 10, 15, 20, 33]));