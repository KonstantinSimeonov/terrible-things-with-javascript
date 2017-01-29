'use strict';

// push, pop, top, size

function swap(i, j, list) {
    const store = list[i];
    list[i] = list[j];
    list[j] = store;
}

function heapifyDown(position, elements, compare) {
    let left = position * 2,
        right = position * 2 + 1,
        largest = position;

    if ((left < elements.length) && compare(elements[left], elements[largest])) {
        largest = left;
    }

    if ((right < elements.length) && compare(elements[right], elements[largest])) {
        largest = right;
    }

    if (largest !== position) {
        swap(position, largest, elements);
        heapifyDown(largest, elements, compare);
    }
}

function heapifyUp(position, elements, compare) {
    const parent = position >> 1;
    if (parent && compare(elements[position], elements[parent])) {
        swap(position, parent, elements);
        heapifyUp(parent, elements, compare);
    }
}

class BinaryHeap {
    static create(compare) {
        return new BinaryHeap(compare);
    }

    static from(elements, compare) {
        return new BinaryHeap(compare).pushMany(...elements);
    }  

    static get defaultCompare() {
        return (first, second) => first > second;
    }


    constructor(compare) {
        this._elements = [null];
        this.compare = compare || BinaryHeap.defaultCompare;
    }

    get size() {
        return this._elements.length - 1;
    }

    get top() {
        return this._elements[1] || null;
    }

    push(item) {
        this._elements.push(item);
        heapifyUp(this.size, this._elements, this.compare);

        return this;
    }

    pushMany(...items) {
        items.forEach(x => this.push(x));

        return this;
    } 

    pop() {

        if(!this.size) {
            return null;
        }

        const top = this.top;
        const last = this._elements.pop();

        if (this.size > 0) {
            this._elements[1] = last;
            heapifyDown(1, this._elements, this.compare);
        }

        return top;
    }
}

module.exports = BinaryHeap;