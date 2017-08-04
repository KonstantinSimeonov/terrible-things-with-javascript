'use strict';

function deepClone(value, cloned = new Map) {
    const isObject = Object.prototype.toString.call(value) === `[object Object]`;
    const isArray = Array.isArray(value);

    if (!isObject && !isArray) {
        return value;
    }

    const previouslyCloned = cloned.get(value);
    if (previouslyCloned) {
        return previouslyCloned;
    }

    const clonedObject = isObject ? Object.create(Object.getPrototypeOf(value)) : [];
    // nobody likes stackoverflow exceptions and buggy references
    cloned.set(value, clonedObject);

    for (const key in value) {
        if (value.hasOwnProperty(key)) {
            clonedObject[key] = deepClone(value[key], cloned);
        }
    }

    return clonedObject;
}

const messyStuff = [1, 2, 3];

const person = {
    messyStuff,
    name: 'zdr',
    birthDate: new Date('11/11/1993'),
    toString() {
        return `${this.name} is born on ${this.birthDate}`;
    }
};

person.self = person;
messyStuff.push([person]);

const p2 = deepClone(person);
console.log(p2);
console.log(p2 === p2.self);
console.log(p2.self === p2.messyStuff[3][0]);

const arr2 = [1, 2, 3];
arr2.push(arr2);

const cl2 = deepClone(arr2);
console.log(cl2);
console.log(cl2 === cl2[3]);

class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        const { x, y } = this;
        return `(${x}, ${y})`;
    }
}

const p = deepClone(new Point(3, 4));
console.log(p.toString());
