'use strict';

const wrap = key => value => ({ [key]: value });
const onResolve = wrap('value');
const onReject = wrap('error');
const transformToResolved = promise => promise.then(onResolve, onReject);

function awaitAll(promises) {
	return Promise.all(promises.map(transformToResolved));
}

awaitAll([
	Promise.resolve('zdr'),
	Promise.reject(10),
	new Promise(resolve => setTimeout(() => resolve(50), 2000))
]).then(results => console.log('promises finished', results), error => console.log('unexpected error', error))
