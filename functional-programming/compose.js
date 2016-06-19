'use strict';

function composition() {
    const functions = [].slice.call(arguments);

    return function (arg) {
        return functions.reduce((memo, curr) => curr(memo), arg);
    };
}

const add3 = x => x + 3,
    stringify = x => x.toString() + '5',
    parse = x => +x,
    increment = x => ++x;

console.log(composition(add3, stringify, parse, increment)(3));