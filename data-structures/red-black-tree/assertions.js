const trace = require('./trace')
const { get_root } = require('./red-black-tree')

const assert_bst_node = N =>
    (!N[0] || (N.value > N[0].value && assert_bst_node(N[0]))) ||
    (!N[1] || (N.value < N[1].value && assert_bst_node(N[1])))

const assert_bst = T => assert_bst_node(get_root(T))

const assert_redblack_tree = T => {
    const root = get_root(T)
    if (root.red)
        return false

    const black_nodes = new Set

    const nodes = [[root, +!root.red]]
    while (nodes.length > 0) {
        const [{ value, red, 0: left, 1: right }, black_count] = nodes.pop()

        const new_black_count = black_count + !red

        if (!left && !right) {
            trace(`leaf ${value} reached. black nodes encountered: ${new_black_count}`)
            black_nodes.add(new_black_count)
        }

        if (red && left && left.red) {
            trace(value, red, left)
            return false
        }

        if (left)
            nodes.push([left, new_black_count])

        if (red && right && right.red) {
            trace(value, red, right)
            return false
        }

        if (right)
            nodes.push([right, new_black_count])
    }

    return black_nodes.size === 1
}

module.exports = {
    assert_bst_node,
    assert_bst,
    assert_redblack_tree
}
