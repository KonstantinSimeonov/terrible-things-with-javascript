const fs = require('fs')

const { mk_rbtree, insert } = require('./red-black-tree')
const trace = require('./trace')
const { assert_redblack_tree, assert_bst } = require('./assertions')
const { tree_to_dot } = require('./dot')

const main = () => {
    const tree = mk_rbtree()
    const xs = [10, 5, 15, 15, 17, 6, 7, 8, 9, 9.5, 34, 42, 43, 37, 38, 36, 39]
    for (let i = 0; i < xs.length; ++i) {
        trace(`============================ ${i}`)
        insert(tree, xs[i])

        // visualization output
        fs.writeFileSync(
            `tree_${i < 10 ? `0${i}` : i}.dot`,
            tree_to_dot(tree, `"${i}"`),
            `utf-8`
        )

        const is_bst = assert_bst(tree)
        const follows_rules = assert_redblack_tree(tree)
        if (!is_bst)
            trace(`bst rules violated`)
        if (!follows_rules)
            trace(`red-black rules violated`)

        if (!is_bst || !follows_rules)
            trace(tree.root[0])
    }
}

main()
