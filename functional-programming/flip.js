'use strict';

const flip = fn => (...args) => fn(...args.reverse()),
    flip$ = fn => (...args) => fn.call(...args.reverse());

const funnyLog = flip(console.log.bind(console));

funnyLog(1, 2, 3);

const funnyReduce = flip([].reduce.bind([10, 15, 20]));

const sum = funnyReduce(0, (sum, current) => sum + current);
console.log(sum);

console.log(flip$([].reduce)(0, (sum, current) => sum + current, [1, 2, 4]))