'use strict';

const BinaryHeap = require('./binary-heap');

const testHeap = BinaryHeap.from([5, 6, -5, 16, 32, 48, 17, 88, -88, 19], (x, y) => x < y);

const sortedTest = Array.from({ length: testHeap.size }).map(() => testHeap.pop());

console.log(sortedTest);