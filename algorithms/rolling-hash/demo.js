'use strict';

const RollingHash = require('./rolling-hash');

const pattern = 'test',
    text = 'test this is a test because gosho is a tester guy but gosho doesn`t like testing and writing unit tests',
    patternHash = new RollingHash(10000009, 211, pattern),
    window = new RollingHash(10000009, 211, text.substr(0, 4));

if(patternHash.equals(window)) {
    console.log('Found match at 0');
}

for(let i = pattern.length, end = text.length; i < end; i += 1) {
    window.roll(text[i - pattern.length], text[i]);

    if(patternHash.equals(window)) {
        console.log(`Found match at ${i - pattern.length}`);
    }
}