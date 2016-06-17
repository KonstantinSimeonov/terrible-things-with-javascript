'use strict';

const pair = (h, t) => fn => fn(h, t),
      first = pair => pair((h, t) => h),
      second = pair => pair((h, t) => t);

function List() {
    let args = [].slice.call(arguments);

    return args.reduceRight((memo, curr) => pair(curr, memo), null);
}

let list = List(1, 5, 10, true, 'gojo', 'cyki kaza che tova e tipichen blek metAl, zashtoto cyki e...');

function forEach(list, fn) {
    if(!list) {
        return;
    }

    fn(first(list));

    forEach(second(list), fn);
}

function map(list, fn) {
    if(!list) {
        return null;
    }

    const mappedFirst = fn(first(list)),
          mappedTail = map(second(list), fn);

    return pair(mappedFirst, mappedTail);
}

function foldl(list, fn, initial) {
    if(initial === undefined) {
        return foldl(second(list), fn, first(list));
    }

    if(!list) {
        return initial;
    }

    const tail = second(list),
          newInitial = fn(initial, first(list));

    return foldl(tail, fn, newInitial);
}

function foldr(list, fn, initial) {
    if(!list) {
        return initial;
    }

    if(!second(list)) {
        return first(list);
    }

    return fn(first(list), foldr(second(list), fn, initial));
}


// forEach(map(list, x => x + 1), console.log);



const data = List.apply(null, [1, 2, 3, 10, 20 ,50, 33]);

const customConcat = (m, c) => m + ', ' + c;

console.log( foldl(data, customConcat) );
console.log( foldr(data, customConcat) );