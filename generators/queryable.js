'use strict';

function* deferred() {
    for(const entry of this) {
        yield entry;
    }
}

function* filter(predicate) {
    for(const entry of this) {
        if(predicate(entry)) {
            yield entry;
        }
    }
}

function* map(transformation) {
    for(const entry of this) {
        yield transformation(entry);
    }
}

function reduce(reducer, initial) {
    let reduced = initial;
    for(const entry of this) {
        reduced = reducer(reduced, entry);
    }
    
    return reduced;
}

function forEach(action) {
    for(const entry of this) {
        action(entry);
    }

    return this;
}

function toArray() {
    return [...this];
}

const queryable = { filter, map, reduce, forEach, toArray };

[filter, map, reduce, deferred].forEach(query => Object.assign(query.prototype, queryable));
[Array, Map].forEach(dataStructure => Object.assign(dataStructure.prototype, { deferred }));

const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const query = nums.deferred().filter(n => n & 1).map(n => n << 1);
console.log(query, query.toArray());

const birthdays = new Map()
                        .set('Pesho', new Date('11/11/2011'))
                        .set('Gosho', new Date('06/07/2008'))
                        .set('Penka', new Date('01/12/1999'));

const namesOfSchoolStudents = birthdays
                                    .deferred()
                                    .filter(([_, birthday]) => birthday > new Date('06/24/1999'))
                                    .map(nameBirthDayPair => nameBirthDayPair[0]);

console.log(namesOfSchoolStudents, namesOfSchoolStudents.toArray());