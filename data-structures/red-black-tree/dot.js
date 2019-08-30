const node_to_dot = (N, visited = new Set) => {
    // don't crash on messed up trees
    if (visited.has(N)) {
        return []
    }

    visited.add(N)

    const children = [N.false, N.true].filter(Boolean)
    const color_opts = `"${N.value}"[color=${N.red ? `red` : `black`}]`
    const N_dot_edges = children.map(c => `"${N.value}" -> "${c.value}"`)
    const children_dot_edges = [].concat(...children.map(x => node_to_dot(x, visited)))

    return [
        color_opts,
        ...N_dot_edges,
        ...children_dot_edges
    ]
}

const tree_to_dot = (T, name) => `digraph ${name} {
    ${node_to_dot(T.root.false).join(`\n    `)}
}`

module.exports = { tree_to_dot }
