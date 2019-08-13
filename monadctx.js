class Maybe {
	constructor(x) {
		this._value = x
	}

	case_of({ just, nothing }) {
		return Maybe.is_just(this) ? just(this._value) : nothing()
	}

	default(x) {
		return this.case_of({ just: id => id, nothing: () => x })
	}

	default_m(x) {
		return Maybe.is_just(this) ? this : Maybe.Just(x)
	}

	// fmap
	then(fn) {
		return Maybe.is_just(this) ? Maybe.Just(fn(this._value)) : Maybe.Nothing
	}

	next() {
		return this.case_of({
			just: () => ({ value: this._value, done: false }),
			nothing: () => ({ done: true })
		})
	}
}

const Just = x => new Maybe(x)
const Nothing = new Maybe
const is_just = m => m !== Nothing
Object.assign(Maybe, { Just, Nothing, is_just })

const is_object = x => x && typeof x === 'object'

const monadctx = generator => (...args) => {
	const it = generator(...args)
	const iterate = value => {
		const step = it.next(value)
		if (step.done) return;

		return is_object(step.value) && `then` in step.value
			? step.value.then(iterate)
			: iterate(step.value)
	}

	iterate()
}

const monad_main = monadctx(function* () {
	const x = yield Just(5)
	const y = yield Promise.resolve(5)

	console.log(x + y)

	const z = yield Nothing.default(42)
	console.log(x + y + z)

	const kek = yield Nothing
	console.log(x + y + z)

	throw 'hello'
})

monad_main()

