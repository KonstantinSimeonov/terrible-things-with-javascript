'use strict';

function sum(a, b) {
    if((typeof a === 'number') && (typeof b === 'number')) {
        return a + b;
    }

    return function (secondOperand) {
        return (typeof a === 'number' ? a : b) + secondOperand;
    }
}

let tests = [
    sum(0, 0),
    sum(1, 2),
    sum(1)(2),
    sum(0)(1)
];

console.log(tests);