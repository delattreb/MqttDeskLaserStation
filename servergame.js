let mqtt = require('mqtt')
let mysql = require('mysql')
let dateFormat = require('dateformat')
let log = require('loglevel')
let env = require('./env')
let credential = require('./credentials')

var options = {
    port: 1884,
    clientId: 'Game Server'
}

log.setDefaultLevel(env.loglevel)

//
// Connection 
//
let clientMqtt = mqtt.connect(credential.address, options)
let connection = mysql.createConnection(credential.db)
clientMqtt.subscribe(env.gametopic)
clientMqtt.subscribe(env.teamtopic)
clientMqtt.subscribe(env.partytopic)
clientMqtt.subscribe(env.starttopic)

clientMqtt.on('connect', function () {
    log.info(dateFormat(new Date(), env.date_format), 'Connected to', credential.address)
})

connection.connect(function () {
    log.info(dateFormat(new Date(), env.date_format), 'Database Connected')
})

clientMqtt.on('message', (topic, message) => {
    log.debug(dateFormat(new Date(), env.date_format), 'Topic', topic)
    log.debug(dateFormat(new Date(), env.date_format), message.toString())
    if (topic.indexOf(env.teamtopic) === 0) {
        let reqsql = 'UPDATE esp SET pseudo=? WHERE name=?'
        let params = [JSON.parse(message).pseudo, JSON.parse(message).jacket]
        sql = mysql.format(reqsql, params)
        procsql(reqsql, params)
    }
})


//
// MySQL
//
function procsql(reqsql, params) {
    sql = mysql.format(reqsql, params)
    connection.query(sql, function (error, results) {
        if (error) {
            log.error(dateFormat(new Date(), env.date_format), 'MySQL connection error')
            throw error
        }
        //log.debug(dateFormat(new Date(), env.date_format), results)
    })
}