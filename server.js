global.rootPath = __dirname

let env = require(`${rootPath}/config/env`)

let sql = require('./lib/sql')
let mosca = require('./lib/mosca')

