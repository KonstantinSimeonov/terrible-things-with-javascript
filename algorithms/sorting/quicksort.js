'use strict';

function quicksort(array) {
    if(!array.length)
        return [];

    const pivot = array.pop(),
        lesserOrEqual = [],
        greater = [];

    array.forEach(x => (x <= pivot) ? lesserOrEqual.push(x) : greater.push(x));

    return [...quicksort(lesserOrEqual), pivot, ...quicksort(greater)];
}

console.log(quicksort([1, 2, 3, 10, 33, -5, -7, 18]));