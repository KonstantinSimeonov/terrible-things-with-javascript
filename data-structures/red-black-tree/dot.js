const { get_root } = require('./red-black-tree')

const node_to_dot = (N, visited = new Set) => {
    // don't crash on messed up trees
    if (visited.has(N)) {
        return []
    }

    visited.add(N)

    const children = [N[0], N[1]].filter(Boolean)
    const color_opts = `"${N.value}"[color=${N.red ? `red` : `black`}]`
    const N_dot_edges = children.map(c => `"${N.value}" -> "${c.value}"`)
    const children_dot_edges = [].concat(...children.map(x => node_to_dot(x, visited)))
    const parent_edge = [
        N.parent.value !== undefined && `"${N.value}" -> "${N.parent.value}"[color=gray]`
    ].filter(Boolean)

    return [
        color_opts,
        ...parent_edge,
        ...N_dot_edges,
        ...children_dot_edges
    ]
}

const tree_to_dot = (T, name) => `digraph ${name} {
    ${node_to_dot(get_root(T)).join(`\n    `)}
}`

module.exports = { tree_to_dot }
