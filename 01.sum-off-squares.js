'use strict';

function sumOdd() {
    return [].slice.call(arguments).reduce((m, c) => m + (c % 2) * (c * c), 0);
}

console.log(sumOdd(1, 2, 3, 4, 5));