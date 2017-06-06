'use strict'

require('../acquire').makeGlobal()

const [http, fs] = acquire('http', 'fs')

const server = http.createServer((req, res) => fs.createReadStream('../acquire/index.js').pipe(res))

const port = 6969

module.exports = new Promise((resolve, reject) => {
    server.listen(port, () => resolve(`http://localhost:${port}`))
})