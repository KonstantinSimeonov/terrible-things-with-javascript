/**
 * Await all promises to resolve/reject, even if some of them reject.
 * 
 * @param {any} promises - Promises to await.
 * @returns Promise<any>
 */
function awaitAll(promises) {
	const { length } = promises;
	const result = [];
	const errorIndexes = new Set;
	let completed = 0;

	return new Promise((resolve, reject) => {
		const onPromiseComplete = () => {
			if (++completed < length) {
				return;
			}

			if (errorIndexes.size) {
				reject(
					result.map((value, index) => {
						if (errorIndexes.has(index)) {
							return { error: value, state: 'rejected' };
						}

						return { value, state: 'resolved' };
					})
				);
			} else {
				resolve(result);
			}
		};

		for (let i = 0; i < length; ++i) {
			promises[i]
				.then(value => {
					result[i] = value;

					onPromiseComplete();
				})
				.catch(error => {
					result[i] = error;
					errorIndexes.add(i);

					onPromiseComplete();
				});
		}
	});
}

awaitAll([
	Promise.resolve('zdr'),
	Promise.reject(10),
	new Promise(resolve => setTimeout(() => resolve(50), 2000))
]).then(stuff => console.log('success', stuff), stuff => console.log('fail', stuff))
