/**
 * Run a promise after at least ms seconds
 * @param {() => Promise} runPromise 
 * @param {Number} ms 
 * @returns 
 */
function after(runPromise, ms) {
	return new Promise(resolve => setTimeout(() => resolve(runPromise()), ms));
}

/**
 * Retry a failed promise a given number of times, waiting given interval time between retries.
 * @param {() => Promise} runPromise 
 * @param {Number} times 
 * @param {Number} interval 
 * @param {any} error 
 * @returns Promise
 */
function retry(runPromise, times, interval, error) {
	if(times < 0) {
		return Promise.reject(error);
	}
	console.log(`try ${times}`);
	return runPromise().catch(reason => after(() => retry(runPromise, times - 1, interval, reason), interval));
}

// timeout(() => Promise.resolve(5), 2000)
// 	.then(console.log)
// 	.catch(console.log);

let rejectCount = 10;
const runPromise = () => (rejectCount-- ? Promise.reject('hui') : Promise.resolve(5));

retry(runPromise, 5, 1000)
	.then(console.log)
	.catch(console.log);
