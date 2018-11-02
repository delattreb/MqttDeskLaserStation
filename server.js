global.rootPath = __dirname

let env = require(`${rootPath}/config/env`)
global.log = require('loglevel')

let sql = require('./lib/sql')
let mosca = require('./lib/mosca')

log.setDefaultLevel(env.loglevel)
