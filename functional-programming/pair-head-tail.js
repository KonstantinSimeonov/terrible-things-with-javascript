'use strict';

const pair = (h, t) => fn => fn(h, t),
      first = p => p((h, _) => h),
      second = p => p((_, t) => t);

function List(...items) {
    return items.reduceRight((memo, curr) => pair(curr, memo), null);
}

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

    if(initial === undefined) {
        return foldr(second(list), fn, first(list));
    }

    if(!list) {
        return initial;
    }

    if(!second(list)) {
        return first(list);
    }

    return fn(first(list), foldr(second(list), fn, initial));
}

function filter(list, predicate) {
    if(!list) {
        return null;
    }
    
    const filteredTail = filter(second(list), predicate);
    
    if(predicate(first(list))) {
        return pair(first(list), filteredTail);
    }
    
    return filteredTail;
}

function zip(leftList, rightList) {
    if(!leftList || !rightList) {
        return null;
    }
    
    const currentZipped = pair(first(leftList), first(rightList));
    
    return pair(currentZipped, zip(second(leftList), second(rightList)));
}

function zipWith(leftList, rightList, fn) {
    return map(zip(leftList, rightList), p => p(fn));
}

function reverse(list) {
    return foldl(list, (m, c) => pair(c, m), null);
}

// forEach(map(list, x => x + 1), console.log);


Array.prototype.toList = function () {
    return List.apply(null, this);
};

Function.prototype.map = function (fn) {
    return map.apply(null, [this, fn]);
};

Function.prototype.forEach = function (fn) {
    return forEach.apply(null, [this, fn]);
};

Function.prototype.filter = function (fn) {
    return filter.apply(null, [this, fn]);
};

Function.prototype.foldl = function (fn, initial) {
    return foldl.apply(null, [this, fn, initial]);
};

Function.prototype.foldr = function (fn, initial) {
    return foldr.apply(null, [this, fn, initial]);
};

Function.prototype.zip = function (other) {
    return zip.apply(null, [this, other]);
};

Function.prototype.zipWith = function (other, fn) {
    return zipWith.apply(null, [this, fn]);
};

Function.prototype.reverse = function () {
    return reverse.apply(null, [this]);
};

Function.prototype.show = function () {
    return '[' + this.foldl((m, c) => m + ', ' + c) + ']';
}

Function.prototype.head = function () {
    return first.call(null, this);
}

Function.prototype.tail = function () {
    return second.call(null, this);
}

const data = [1, 2, 3, 10, 20 ,50, 33].toList();

const customConcat = (m, c) => m + ', ' + c;

console.log( data.filter(x => x % 2).map(x => x + 1).foldr(customConcat) );
console.log( data.zip(['a', 'b', 'c'].toList()).map(x => x((h, t) => `(${h}, ${t})`)).show() );

const listAsString = [1, 2, 3].toList().reverse().show();

console.log(listAsString);

      