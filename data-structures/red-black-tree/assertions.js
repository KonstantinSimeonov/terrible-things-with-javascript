const trace = require('./trace')

const assert_bst_node = N =>
    (!N.false || (N.value > N.false.value && assert_bst_node(N.false))) ||
    (!N.true || (N.value < N.true.value && assert_bst_node(N.false)))

const assert_redblack_tree = T => {
    if (T.root.false.red)
        return false

    const black_nodes = new Set

    const nodes = [[T.root.false, +!T.root.false.red]]
    while (nodes.length > 0) {
        const [{ value, red, false: left, true: right }, black_count] = nodes.pop()

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

module.exports = { assert_bst_node, assert_redblack_tree }
