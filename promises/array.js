const arrayMethodNames = [
	'concat',
	'copyWithin',
	'every',
	'filter',
	'find',
	'findIndex',
	'forEach',
	'includes',
	'indexOf',
	'join',
	'lastIndexOf',
	'map',
	'reduce',
	'reduceRight',
	'reverse',
	'slice',
	'some',
	'sort',
];

for(const name of arrayMethodNames) {
	const [fst, ...rest] = name;
	const capitalizedName = fst.toUpperCase() + rest.join('');
	Promise.prototype['then' + capitalizedName] = function (...args) {
		return this.then(values => values[name](...args))
	}
}

const promises = [1, 2, 5, 10, 11, 13, 42, 69].map(x => Promise.resolve(x));

Promise.all(promises)
	.thenFilter(n => n % 2)
	.thenMap(n => n + 1)
	.thenForEach(x => console.log(x));
