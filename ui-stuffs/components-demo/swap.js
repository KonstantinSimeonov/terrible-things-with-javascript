const swap = (indexedCollection, x, y) => {
  [indexedCollection[x], indexedCollection[y]] = [indexedCollection[y], indexedCollection[x]];
};
