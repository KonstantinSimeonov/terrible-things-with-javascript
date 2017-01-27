'use strict';

const fs = require('fs');

const { compress, decompress } = require('./index');

const compressed = compress(fs.readFileSync('./test.txt', 'ascii'));

const dec = decompress(compressed);

console.log(dec);