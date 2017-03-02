'use strict';

function composition(...functions) {
    return arg => functions.reduce((partialResult, nextFn) => nextFn(partialResult), arg);
}

const add3 = x => x + 3,
    stringify = x => x.toString() + '5',
    parse = x => +x,
    increment = x => ++x;

console.log(composition(add3, stringify, parse, increment)(3));