const id   = x => x
// cheating
const tuple = (...args) => fn_or_int =>
    typeof fn_or_int === 'function'
        ? fn_or_int(...args)
        : args[fn_or_int]
const fst  = p => p(id)
const snd  = p => p((_, y) => y)
// more cheating
const flip = (fn, n = 2) => (...args) => fn(...args.slice(0, n).reverse())
const trace = (...args) => (console.log(...args), args[0])

const sub = (x, y) => x - y
trace(flip(sub)(1, 2))

const ListEmpty = {}
const is_empty = xs => xs === ListEmpty

// cheating yet again
const List = (...xs) => xs.reduceRight(flip(tuple), ListEmpty)

const fold_right = (fn, x0, xs) => is_empty(xs)
    ? x0
    : fn(fold_right(fn, x0, snd(xs)), fst(xs))

const reduce_right = (fn, xs) => is_empty(snd(xs))
    ? fst(xs)
    : fn(reduce_right(fn, snd(xs)), fst(xs))

const show_list = xs => `[${
    is_empty(xs) ? `` : reduce_right((x, y) => `${y}, ${x}`, xs)
}]`

const map = (fn, xs) => fold_right((ys, x) => tuple(fn(x), ys), ListEmpty, xs)

const filter = (fn, xs) => fold_right((ys, x) => fn(x) ? tuple(x, ys) : ys, ListEmpty, xs)

const fold_left = (fn, x0, xs) => is_empty(xs) ? x0 : fold_left(fn, fn(x0, fst(xs)), snd(xs))

const reduce_left = (fn, xs) => fold_left(fn, fst(xs), snd(xs))

const reverse = xs => fold_left(flip(tuple), ListEmpty, xs)

const take_while = (fn, xs) => is_empty(xs)
    ? ListEmpty
    : (
        fn(fst(xs))
            ? tuple(fst(xs), take_while(fn, snd(xs)))
            : take_while(fn, snd(xs))
    )

const take = (n, xs) => (n === 0 || is_empty(xs))
    ? ListEmpty
    : tuple(fst(xs), take(n - 1, snd(xs)))

const concat = (...xss) => fold_right(
    (xs, y) => fold_right(flip(tuple), xs, y),
    ListEmpty,
    List(...xss)
)

const length = xs => is_empty(xs) ? 0 : 1 + length(snd(xs))

const zip = (xs, ys) => (is_empty(xs) || is_empty(ys))
    ? ListEmpty
    : tuple(tuple(fst(xs), fst(ys)), zip(snd(xs), snd(ys)))

const show_tuple = p => p((x, y) => `(${x}, ${y})`)

const sum = (x, y) => x + y
const test = List(1, 2, 3, 4, 5)
trace(
    new Set([
        // all should have same result
        fold_right(sum, 0, test),
        reduce_right(sum, test),
        fold_left(sum, 0, test),
        reduce_left(sum, test)
    ]).size === 1,

    show_list(map(length, List(
        List(),
        List(1),
        List(1, 2),
        List(1, 2, 3)
    ))),

    show_list(map(show_tuple, zip(
        List(1, 2, 3),
        List(`a`, `b`, `c`)
    )))
)
trace(
    show_list(
        map(
            x => x * 2,
            filter(x => x % 2, test)
        )
    ),
    show_list(reverse(test)),
    show_list(take_while(x => x < 4, test)),
    show_list(take(4, test)),
    show_list(take(4, List(1, 2))),
    show_list(List()),
    show_list(take(4, List()))
)
trace(
    show_list(
        concat(
            List(1, 2, 3),
            List(4, 5),
            List(),
            List(6),
            List(7, 8, 9, 10)
        )
    )
)
trace(
    tuple(1, 2, 3, 4, 5)(3)
)
