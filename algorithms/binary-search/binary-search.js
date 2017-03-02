'use strict';

function binarySearchIter(value, array) {
    let low = 0,
        high = array.length - 1,
        middle = (low + high) >> 1 | 0;

    while(low <= high) {
        if(array[middle] === value) {
            return middle;
        }

        if(array[middle] < value) {
            low = middle + 1;
        } else {
            high = middle - 1;
        }

        middle = (low + high) >> 1 | 0;
    }

    return -1;
}

function binarySearchRec(value, array, low, high) {
    if(low > high) {
        return -1;
    }

    low = low || 0;
    high = high || array.length - 1;

    const middle = (low + high) >> 1 | 0;

    if(array[middle] === value) {
        return middle;
    } else if(value < array[middle]) {
        return binarySearchRec(value, array, low, middle - 1);
    } else {
        return binarySearchRec(value, array, middle + 1, high);
    }
}

console.log(binarySearchIter(33, [-20, 4, 10, 15, 33]));
console.log(binarySearchRec(33, [-20, 4, 10, 15, 20, 33]));