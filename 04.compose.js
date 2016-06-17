'use strict';

function compose() {
    let functions = [].slice.call(arguments);

    return function (arg) {
        return functions.reduce((memo, curr) => curr(memo), arg);
    }
}

let add3 = x => x + 3;
let stringify = x => x.toString() + '5';
let parse = x => +x;
let increment = x => ++x;

console.log(compose(add3, stringify, parse, increment)(3));