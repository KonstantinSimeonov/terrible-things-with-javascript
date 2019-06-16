const make_bound = object => {
	const _fns = Object.create(null)
	return new Proxy(object, {
		get(target, key) {
			const target_value = target[key];
			const target_is_func = typeof target_value === 'function';
			if (target_is_func && !_fns[key]) {
				_fns[key] = target_value.bind(target);
			}

			return target_is_func ? _fns[key] : target_value;
		}
	});
};

const { map, reduce, length } = make_bound([1, 2, 3, 4, 5]);

console.log(
	map(x => x * 2),
	reduce((product, x) => product * x, 1),
	length
);
