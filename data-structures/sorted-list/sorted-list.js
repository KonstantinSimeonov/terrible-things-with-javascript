'use strict';

class SortedList {
    static from(items, compare) {
        const list = new SortedList({ items, compare });

        return list;
    }

    static get defaultCompare() {
        return (a, b) => (a < b) ? -1 : ((a > b) ? 1 : 0);
    }

    constructor(options) {
        this.compare = (options && options.compare) ? options.compare : SortedList.defaultCompare;
        this._elements = (options && options.items) ? options.items.slice().sort() : [];
    }

    get length() {
        return this._elements.length;
    }

    push(...items) {
        items.forEach(i => this._pushOne(i));
    }

    binarySearch(item) {
        const self = this;

        let s = 0,
            e = self._elements.length,
            m = (s + e) >> 1;

        while (s <= e) {
            const comparison = self.compare(item, self.at(m));

            if (comparison < 0) {
                e = m - 1;
            } else if (comparison > 0) {
                s = m + 1;
            } else {
                return m;
            }

            m = (s + e) >> 1;
        }

        return s;
    }

    at(index) {
        return this._elements[index];
    }

    _pushOne(item) {
        const insertIndex = this.binarySearch(item);

        this._insert(item, insertIndex);
    }

    _insert(item, index) {
        const self = this;

        for (let i = self.length; i > index; i -= 1) {
            self._elements[i] = self._elements[i - 1];
        }

        self._elements[index] = item;
    }

    *[Symbol.iterator] () {
        for(let v of this._elements) {
            yield v;
        }
    }

    toString () {
        const itemsStr = this._elements.join(', ');
        return `{ ${itemsStr} }`
    }
}

if(typeof module !== 'undefined') {
    module.exports = SortedList;
}

