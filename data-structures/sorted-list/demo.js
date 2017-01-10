'use strict';

const SortedList = require('./sorted-list');

const test = SortedList.from([], (a, b) => (a < b) ? 1 : (a > b) ? -1 : 0);

test.push(5, 1, 3, -5, 10, 11);

for(let v of test) {
    console.log(v);
}