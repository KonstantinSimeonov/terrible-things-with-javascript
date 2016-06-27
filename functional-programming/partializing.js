'use strict';

function partialize(fn) {

    return function partial(...partialArgs) {

        if(partialArgs.length >= fn.length) {
            return fn.apply(null, partialArgs);
        } 
        
        return function (...innerArgs) {
            return partial.apply(null, partialArgs.concat(innerArgs));
        }
    }
}

function sum(a, b, c, d) {
    return a + b + c + d;
}

let partialSum = partialize(sum);

let test = [
    partialSum(1, 2, 3, 4),
    partialSum(1, 2)(3, 4),
    partialSum(1)(2, 3)(4),
    partialSum(1, 2)(3)(4)
];

console.log(test);