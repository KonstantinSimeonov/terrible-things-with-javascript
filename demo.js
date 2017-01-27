'use strict';

const fs = require('fs');

const compress = require('./index');

fs.writeFileSync('testout', compress(fs.readFileSync('./test.txt', 'ascii')), { encoding: 'ascii' });