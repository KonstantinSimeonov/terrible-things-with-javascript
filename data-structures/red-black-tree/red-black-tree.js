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
    const dir = +(N.value < x)
    if (N[dir])
        return insert_node(N[dir], x)
    else
        return N[dir] = mk_node(x, N, true)
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
    N[N_dir] = G
    G.parent = N

    P[N_dir] = N[+!N_dir]
    N[+!N_dir] = P
    P.parent = N

    N.red = false
    G.red = true
}

const keep_invariant = N => {
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
            keep_invariant(G)

        return
    }

    const rotate = is_inner_child(N)
        ? rotate_inner
        : rotate_outer

    rotate(N)
}

const insert = (T, x) => {
    if (!T.root[0]) {
        return T.root[0] = mk_node(x, T.root, false)
    }

    const N = insert_node(T.root[0], x)
    keep_invariant(N)
    T.root[0].red = false

    return N
}

const insert_many = (T, ...xs) => xs.forEach(x => insert(T, x))

const lookup = (T, x) => T.root[0] && lookup_node(T.root[0], x)

module.exports = {
    mk_rbtree,
    insert,
    lookup
}
