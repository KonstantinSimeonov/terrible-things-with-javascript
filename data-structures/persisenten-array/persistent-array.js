'use strict';

const PersistentArray = (function () {

    function create(depth, left, right) {

        if(!depth)
            return { index: left }

        const middle = (left + right) / 2;

        return {
            index: middle,
            left: create(depth - 1, left, middle),
            right: create(depth - 1, middle, right)
        }
    }

    function update(index, value, current) {
        
        if(!current.left && !current.right)
            return { index, value }

        const next = (index < current.index) ? current.left : current.right,
            newChild = update(index, value, next);

        if(index < current.index)
            return { 
                index: current.index, 
                left: newChild, 
                right: current.right
             }
        else
            return { 
                index: current.index, 
                left: current.left, 
                right: newChild
             }
    }

    function at(index, current) {
        
        if(!current.left && !current.right)
            return current.value;

        return (index < current.index) ? at(index, current.left) : at(index, current.right);
    }

    // apparently we have a creativity crisis
    function ihavenoshittingideadhowtonamethisidioticfunction(array) {
        // use recursive steps to enable chaining
        return {
            update: function (index, value) {

                const newArray = update(index, value, array);

                return ihavenoshittingideadhowtonamethisidioticfunction(newArray);
            },
            at: function (index) {
                return at(index, array);
            }
        }
    }

    return function (length) {

        const depth = Math.ceil(Math.log2(length)),
            array = create(depth, 0, 1 << depth);

        return ihavenoshittingideadhowtonamethisidioticfunction(array);
    }
})();

// let druvo = PersistentArray(32).update(0, 0).update(1, 'uho');

// let druvo2 = druvo.update(18, 'pzo');
// druvo = druvo.update(19, {});

// Array.from({length: 31}).map((_, i) => i).forEach(i => console.log(druvo.at(i), i))
// [0, 1, 18, 19].forEach(i => console.log(
//     i, druvo.at(i), druvo2.at(i)
// ))