'use strict';

function encode(arr) {

    if(!arr.length) {
        return []
    }

    if(arr.length === 1) {
        return [[1, arr[0]]]
    }

    let [f, ...rest] = arr

    if(f === rest[0]) {
        let [first, ...other] = encode(rest)

        return [[first[0] + 1, first[1]], ...other]
    }

    return [[1, f], ...encode(rest)]
    // return [].concat([[1, f]], encode(rest))
}

const tests = [
    [1, 1, 1, 3, 2, 3, 3, 6, 6, 6, 1, 2, 3],
    [1],
    [1, 1, 2, 2, 3],
    ['je suis', 'je suis', 0],
    []
]

console.log(tests.map(encode))