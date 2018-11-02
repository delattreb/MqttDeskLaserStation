global.rootPath = __dirname;

let env = require(`${rootPath}/env`)
global.log = require('loglevel')

let sql = require('./sql')
let mosca = require('./mosca')

log.setDefaultLevel(env.loglevel)
