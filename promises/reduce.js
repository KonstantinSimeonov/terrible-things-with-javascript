/**
 * Takes an iterable/iterator to promises and resolves the promises sequentially.
 * The result from the current promise is fed to the next, resulting in reduce-like
 * fashion. If any promise fails, the chain fails.
 * @param {any} promises - Promises that will be run in that order.
 * @returns Promise<any>
 */
function reduce(promises) {
	const result = [];
	const promisesIterator = promises.next ? promises : promises[Symbol.iterator]();

	function _sequence(value) {
		arguments.length && result.push(value);
		
		const { value: runPromise, done } = promisesIterator.next();

		if (done) return result;

		return (runPromise.then ? runPromise : runPromise(value)).then(_sequence);
	}

	return _sequence();
}

function* promises() {
	console.log('first');
	yield new Promise((resolve, reject) => setTimeout(() => resolve(5), 4000));

	console.log('second');
	yield (value) => Promise.resolve('gosho' + value);

	console.log('third');
	yield value => new Promise((resolve, reject) => setTimeout(() => resolve('zdr kp' + value), 1000))
}

reduce(
	promises()
).then(stuff => console.log('success', stuff))
	.catch(stuff => console.log('fail', stuff));
