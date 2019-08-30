const util = require('util')

let _silent = true

const silent = (s = false) => _silent = s

const trace = (...args) => (_silent && console.log(
    ...args.map(
        a => util.inspect(a, { depth: Infinity })
    )
)) || args[0]

module.exports = Object.assign(trace, { silent })
