const merge = (...objects) => {
	const last_index = objects.length - 1;

	return new Proxy({}, {
		get(target, key) {
			if(key in target)
				return target[key];

			for(let i = last_index; i >= 0; --i) {
				const from = objects[i];
				if(key in from)
					return target[key] = from[key];
			}
		}
	});
};

const test = merge({ a: 5, b: 'haskell', pi: Math.PI }, { a: 3 }, { c: {} }, { pi: NaN, a: 8 });

const { pi, c, a, b } = test;

console.log(pi, c, a, b);
