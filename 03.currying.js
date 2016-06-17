'use strict';

function curry(fn) {

    return function partial() {
        let partialArgs = [].slice.call(arguments);

        if(partialArgs.length >= fn.length) {
            return fn.apply(null, partialArgs);
        } 
        
        return function () {
            let innerArgs = [].slice.call(arguments);

            return partial.apply(null, partialArgs.concat(innerArgs));
        }
    }
}

function sum(a, b, c, d) {
    return a + b + c + d;
}

let curriedSum = curry(sum);

let test = [
    curriedSum(1, 2, 3, 4),
    curriedSum(1, 2)(3, 4),
    curriedSum(1)(2, 3)(4),
    curriedSum(1, 2)(3)(4)
];

console.log(test);