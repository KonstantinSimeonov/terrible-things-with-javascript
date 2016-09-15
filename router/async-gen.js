'use strict';

function *getDataAsync() {

    const dataSource = ['sdfsd', 'aaa', 'erer', 'dsfs'];

    let current = 0;

    const kef = yield;
    console.log('hello');
    while(true) {
        console.log(dataSource);
            yield (dataSource[current++]);
        
    }

}

const dataGen = getDataAsync();

console.log(dataGen.next());