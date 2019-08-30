const trace = require('./trace')

const mk_node = (
    value,
    parent = null,
    red = false,
    left = null,
    right = null
) => ({ value, red, parent, 0: left, 1: right })

const mk_rbtree = () => ({ root: mk_node(undefined) })

const insert_node = (N, x) => {
    if (N.value === x)
        return

    const dir = +(N.value < x)
    return N[dir]
        ? insert_node(N[dir], x)
        : N[dir] = mk_node(x, N, true)
}

const lookup_node = (N, x) => {
    if (N.value === x)
        return N

    const dir = +(N.value < x)
    return N[dir] && lookup_node(N[dir], x)
}

const get_dir = N => +(N.parent[1] === N)
const is_left_child = N => N.parent[0] === N
const is_inner_child = N => is_left_child(N) !== is_left_child(N.parent)
const sibling = N => N.parent[+!get_dir(N)]

const rotate_outer = N => {
    trace(`outer rotate for ${N.value}`)
    const P = N.parent
    const G = P.parent
    const R = G.parent

    const N_dir = get_dir(N)
    const P_dir = get_dir(P)
    const G_dir = get_dir(G)

    G[P_dir] = P[+!N_dir]
    if (G[P_dir]) G[P_dir].parent = G
    G.parent = P
    P[+!N_dir] = G


    R[G_dir] = P
    P.parent = R

    P.red = false
    G.red = true
}

const rotate_inner = N => {
    trace(`inner rotate for ${N.value}`)
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
    if (G[P_dir]) G[P_dir].parent = G
    N[N_dir] = G
    G.parent = N

    P[N_dir] = N[+!N_dir]
    if (P[N_dir]) P[N_dir].parent = P
    N[+!N_dir] = P
    P.parent = N

    N.red = false
    G.red = true
}

const maintain_invariant = N => {
    if (N.red !== N.parent.red) {
        return
    }
    trace(`invariant for ${N.value}`)

    const P = N.parent
    const U = sibling(P)
    const G = P.parent

    // recolor
    if (U && U.red) {
        trace(`recoloring ${N.value}`)
        for (const n of [P, G, U])
            n.red = !n.red

        if (G.parent)
            maintain_invariant(G)

        return
    }

    const rotate = is_inner_child(N)
        ? rotate_inner
        : rotate_outer

    rotate(N)
}

const insert = (T, x) => {
    if (!T.root[0])
        return T.root[0] = mk_node(x, T.root, false)

    const N = insert_node(T.root[0], x)
    if (N) {
        maintain_invariant(N)
        T.root[0].red = false
    }

    return N
}

const it_node = function* (N) {
    if (!N) return
    yield* it_node(N[0])
    yield N
    yield* it_node(N[1])
}

const it_values = function* (N) {
    for (const node of it_node(N))
        yield* node.value
}

const fold = (it, x0, fn) => {
    let result = x0
    for (const x of it)
        result = fn(result, x)
    return result
}

const rem = (N, x) => {
    const N_dir = get_dir(N)
    if (!N[0] && !N[1]) {
        N.value === 15 && trace(N)
        N.parent[N_dir] = null
        N.parent = null
        return true
    }

    const dir = [0, 1].find(childIndex => N[childIndex])
    if (!N[dir])
        return
    const successor = fold(
        it_node(N[dir]),
        N[dir],
        (succ, x) => (+(succ.value < x.value) === dir) ? succ : x
    )

    trace(successor.value)

    successor.parent[get_dir(successor)] = [0, 1].map(i => successor[i]).find(Boolean) || null

    N.parent[N_dir] = successor
    successor.parent = N.parent
    for (const i of [0, 1].filter(i => N[i]))
        successor[i] = N[i]
}

const bst_remove_node = (N, x) => {
    if (N.value === x)
        return rem(N, x)

    const dir = +(N.value < x)
    return N[dir] && bst_remove_node(N[dir], x)
}

const bst_remove = (T, x) => bst_remove_node(get_root(T), x)

const insert_many = (T, ...xs) => xs.forEach(x => insert(T, x))

const lookup = (T, x) => T.root[0] && lookup_node(T.root[0], x)

const get_root = T => T.root[0]

const it = T => it_values(get_root(T))

module.exports = {
    mk_rbtree,
    insert,
    insert_many,
    get_root,
    lookup,
    it,
    bst_remove
}
