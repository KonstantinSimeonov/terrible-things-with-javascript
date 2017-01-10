'use strict';

const PersistentArray = require('./persistent-array');

let tree = PersistentArray(32).update(0, 0).update(1, 'uho');

let tree2 = tree.update(18, 'pzo');
tree = tree.update(19, {});

Array.from({length: 31}).map((_, i) => i).forEach(i => console.log(tree.at(i), i));

[0, 1, 18, 19].forEach(i => console.log(i, tree.at(i), tree2.at(i)));