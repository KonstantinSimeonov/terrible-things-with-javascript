const fs = require('fs')

const {
    bst_remove,
    mk_rbtree,
    insert,
    insert_many,
    get_root,
    it
} = require('./red-black-tree')
const trace = require('./trace')
const { assert_redblack_tree, assert_bst } = require('./assertions')
const { tree_to_dot } = require('./dot')

const test_insert = (tree, xs) => {
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
            trace(get_root(tree))

        //trace([...it(tree)])
    }
}

const test_remove = (tree, xs) => {
    trace.silent()
    insert_many(tree, ...xs)
    trace.silent(true)

    fs.writeFileSync(`0before_remove.dot`, tree_to_dot(tree, `xs`), `utf-8`)
    let i = 0
    for (const x of [16, 9.5, 42]) {
        bst_remove(tree, x)
        fs.writeFileSync(`${++i}.dot`, tree_to_dot(tree, `xs`), `utf-8`)
    }
}

const main = () => {
    const tree = mk_rbtree()
    const xs = [10, 5, 15, 15, 17, 16, 6, 7, 8, 9, 9.5, 34, 42, 43, 37, 38, 36, 39, 15.5]
    //test_insert(tree, xs)
    test_remove(tree, xs)
}

main()
