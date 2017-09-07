/**
 * Promise that will time out after a given time.
 * 
 * @param {() => Promise} runPromise 
 * @param {Number} ms 
 * @returns Promise
 */
function timeout(runPromise, ms) {
	return new Promise((resolve, reject) => {
		runPromise().then(resolve);

		setTimeout(() => reject(new Error('Promise timed out.')), ms);
	});
}

const runPromise = () => new Promise((resolve, reject) => {
	setTimeout(() => resolve(10), 10000);
});

timeout(runPromise, 3000)
	.then(console.log)
	.catch(console.log);