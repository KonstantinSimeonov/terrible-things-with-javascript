'use strict';

const fs = require('fs');

const { compress, decompress } = require('./index');

// let compressed = compress(fs.readFileSync('../test.txt', 'ascii'));
const compressed = fs.readFileSync('../test.min.txt');
const dec = decompress(compressed);

console.log(dec);