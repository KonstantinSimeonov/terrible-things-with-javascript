'use strict';

const range = function (s, e) {

    const queries = [];

    function* range(start, count) {
        for(let i = start; i < start + count; i += 1) {
            yield i;
        }
    }

    this.map = fn => { queries.push(fn); return this; };
    this.take = count => { e = count; return this; };
    this.skip = count => { s += count; return this; };
    this.toArray = function () {
        const res = [], r = range(s, e);

        let next = r.next();

        while(!next.done) {
            res.push(queries.reduce((m, c) => c(m), next.value));
            next = r.next();
        }

        return res;
    };

    return this;
};
let r = new range(0, 10).skip(3).map(x => x + 1).take(2).map(x => x * 2).map(x => x - 1);

console.log(r.toArray());