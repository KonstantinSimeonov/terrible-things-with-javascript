'use strict';

const Enumerable = (function () {

    function map(projectFn) {
        this.queries.push({ fn: projectFn, type: 'project' });
        return this;
    }

    // TODO: make take and skip lazy
    function take(count) {
        this.count = count;
        return this;
    }

    function skip(count) {
        for (let i = 0; i < count; i += 1) {
            this.source.next();
        }
        return this;
    }

    function filter(predicateFn) {
        this.queries.push({ fn: predicateFn, type: 'predicate' });
        return this;
    }

    // TODO: refactor and abstract the iteration with callback to simplify implementation of foldl
    function toArray() {
        const self = this;

        while (!self.source.done() && self.count) {

            let value = self.source.next(),
                failedPredicate = false;

            if (self.queries.length) {
                for (const query of self.queries) {

                    if (query.type === 'predicate') {
                        if (!query.fn(value)) {
                            failedPredicate = true;
                            break;
                        }
                    } else {
                        value = query.fn(value);
                    }

                }
            }

            if (!failedPredicate && !self.source.done()) {
                self.result.push(value);
                self.count -= 1;
            }
        }

        return self.result;
    }

    // TODO: make it.. okay?
    function Source() {
        const src = arguments[0];

        if (src instanceof Array) {

            let current = 0,
                done = false;

            return {
                next: function () {

                    if (done) {
                        throw new Error('Cannot move iterator further');
                    }

                    if ((current + 1) >= src.length) {
                        done = true;
                    }

                    current += 1;

                    return src[current - 1];
                },
                done: () => done
            };
        } else {

            let step,
                done = false;

            return {
                next: function () {
                    if (done) {
                        throw new Error('Cannot move iterator further');
                    }

                    step = src.next();

                    if (!step.done) {
                        return step.value;
                    }

                    done = true;
                },
                done: () => done
            };

        }
    }

    return function (src) {
        return {
            source: Source(src),
            queries: [],
            result: [],
            count: src.length || Infinity,
            map,
            filter,
            take,
            skip,
            toArray
        };
    };
} ());

let nums = Enumerable([1, 2, 3, 4, 5, 6, 7])
                                .filter(x => x !== 1)
                                .skip(1)
                                .map(x => x * x)
                                .take(3)
                                .skip(1);
// TODO: encapsulation
function* range(start, count) {
    for (let i = start; i < start + count; i += 1) {
        yield i;
    }
}

Enumerable.range = function (start, count) {
    return Enumerable(range(start, count));
}

console.log(Enumerable.range(5, 10).filter(x => x % 4).map(x => x + ' is not divisible by 4').take(5).toArray());