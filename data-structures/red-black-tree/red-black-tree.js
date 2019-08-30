const util = require('util')
const fs = require('fs')

let _debug = true

const _trace = (...args) => (_debug && console.log(
    ...args.map(
        a => util.inspect(a, { depth: Infinity })
    )
)) || args[0]

const mk_node = (
    value,
    parent = null,
    red = false,
    left = null,
    right = null
) => ({ value, red, parent, false: left, true: right })

const mk_rbtree = () => ({ root: mk_node(undefined) })

const insert_node = (N, x) => {
    const dir = N.value < x
    if (N[dir])
        return insert_node(N[dir], x)
    else
        return N[dir] = mk_node(x, N, true)
}

const lookup_node = (N, x) => {
    if (N.value === x)
        return N

    const dir = N.value < x
    return N[dir] && lookup_node(N[dir], x)
}

const get_dir = N => N.parent.true === N
const is_left_child = N => N.parent.false === N
const is_inner_child = N => is_left_child(N) !== is_left_child(N.parent)
const sibling = N => N.parent[!get_dir(N)]

const rotate_outer = N => {
    _trace(`outer rotate for ${N.value}`)
    const P = N.parent
    const G = P.parent
    const R = G.parent

    const N_dir = get_dir(N)
    const P_dir = get_dir(P)
    const G_dir = get_dir(G)

    G[P_dir] = P[!N_dir]
    G.parent = P
    P[!N_dir] = G


    R[G_dir] = P
    P.parent = R

    P.red = false
    G.red = true
}

const rotate_inner = N => {
    _trace(`inner rotate for ${N.value}`)
    const P = N.parent
    const G = P.parent
    const R = G.parent

    const N_dir = get_dir(N)
    const G_dir = get_dir(G)
    const P_dir = get_dir(P)

    // replace pivot with node
    R[G_dir] = N
    N.parent = R

    G[P_dir] = N[N_dir]
    N[N_dir] = G
    G.parent = N

    P[N_dir] = N[!N_dir]
    N[!N_dir] = P
    P.parent = N

    N.red = false
    G.red = true
}

const keep_invariant = N => {
    if (N.red !== N.parent.red) {
        return
    }
    _trace(`invariant for ${N.value}`)

    const P = N.parent
    const U = sibling(P)
    const G = P.parent

    // recolor
    if (U && U.red) {
        _trace(`recoloring ${N.value}`)
        for (const n of [P, G, U])
            n.red = !n.red

        if (G.parent)
            keep_invariant(G)

        return
    }

    const rotate = is_inner_child(N)
        ? rotate_inner
        : rotate_outer

    rotate(N)
}

const insert = (T, x) => {
    if (!T.root.false) {
        return T.root.false = mk_node(x, T.root, false)
    }

    const N = insert_node(T.root.false, x)
    keep_invariant(N)
    T.root.false.red = false

    return N
}
const insert_many = (T, ...xs) => xs.forEach(x => insert(T, x))
const lookup = (T, x) => T.root.left && lookup_node(T.root.left, x)

const assert_bst_node = N =>
    (!N.false || N.value > N.false.value) ||
    (!N.true || N.value < N.true.value)

const assert_redblack_tree = T => {
    if (T.root.false.red)
        return false

    const black_nodes = new Set

    const nodes = [[T.root.false, +!T.root.false.red]]
    while (nodes.length > 0) {
        const [{ value, red, false: left, true: right }, black_count] = nodes.pop()

        const new_black_count = black_count + !red

        if (!left && !right) {
            _trace(`leaf ${value} reached. black nodes encountered: ${new_black_count}`)
            black_nodes.add(new_black_count)
        }

        if (red && left && left.red) {
            _trace(value, red, left)
            return false
        }

        if (left)
            nodes.push([left, new_black_count])

        if (red && right && right.red) {
            _trace(value, red, right)
            return false
        }

        if (right)
            nodes.push([right, new_black_count])
    }

    return black_nodes.size === 1
}

const to_dot = (N, visited = new Set) => {
    // don't crash on messed up trees
    if (visited.has(N)) {
        return []
    }

    visited.add(N)

    const children = [N.false, N.true].filter(Boolean)
    const color_opts = `"${N.value}"[color=${N.red ? `red` : `black`}]`
    const N_dot_edges = children.map(c => `"${N.value}" -> "${c.value}"`)
    const children_dot_edges = [].concat(...children.map(x => to_dot(x, visited)))

    return [
        color_opts,
        ...N_dot_edges,
        ...children_dot_edges
    ]
}

const to_dot_tree = (T, name) => `digraph ${name} {
    ${to_dot(T.root.false).join(`\n    `)}
}`


const test = () => {
    const tree = mk_rbtree()
    const xs = [10, 5, 15, 17, 6, 7, 8, 9, 9.5, 34, 42, 43, 37, 38, 36, 39]
    for (let i = 0; i < xs.length; ++i) {
        _trace(`============================ ${i}`)
        insert(tree, xs[i])

        // visualization output
        fs.writeFileSync(
            `tree_${i < 10 ? `0${i}` : i}.dot`,
            to_dot_tree(tree, `"${i}"`),
            `utf-8`
        )

        const is_bst = assert_bst_node(tree.root.false)
        const follows_rules = assert_redblack_tree(tree)
        if (!is_bst)
            _trace(`bst rules violated`)
        if (!follows_rules)
            _trace(`red-black rules violated`)

        if (!is_bst || !follows_rules)
            _trace(tree.root.false)
    }
}

test()
