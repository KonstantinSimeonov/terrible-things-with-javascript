'use strict';

const http = require('http');

function get(url) {
    return new Promise((resolve, reject) => {
        const chunks = [];
        http.get(url, response$ => {
            response$
                .on('data', chunk => chunks.push(chunk.toString()))
                .on('end', () => resolve(chunks))
                .on('error', error => reject(error));
        });
    });
}

// awful code
function runGenerator(generator, ...args) {
    const iterator = generator(...args);(

    (function iterateAsync(value) {
        const ret = iterator.next(value);

        if('then' in ret.value) {
            ret.value.then(iterateAsync);
        } else {
            setImmediate(() => iterateAsync(ret.value));
        }
    }))();
}

// that allows us to write async-await like with awful syntax :D
runGenerator(function * main() {
    const v1 = yield get('http://telerikacademy.com');
    
    const v2 = yield get('http://horsebin.herokuapp.com');

    console.log(v1);
    console.log('------------------------------------------');
    console.log(v2);
    // wa wa
});