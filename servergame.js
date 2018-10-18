let mqtt = require('mqtt') 
let mysql = require('mysql') 
let dateFormat = require('dateformat') 
let log = require('loglevel') 
let env = require('./env') 
let credential = require('./credentials') 

var options = {
    port: 1884,
    //host: 'mqtt://mycube.dscloud.me',
    clientId: 'Game Server'
    //keepalive: 60,
    //reconnectPeriod: 1000,
    //protocolId: 'MQIsdp',
    //protocolVersion: 3,
    //clean: true,
    //encoding: 'utf8'
} 

log.setDefaultLevel(env.loglevel) 
let connection 

let clientMqtt = mqtt.connect(credential.address, options) 
connection = mysql.createConnection(credential.db) 

//
// Connection
//
let promiseMqtt = new Promise(function (resolve, reject) {
    clientMqtt.subscribe(env.topic_hum) 
    clientMqtt.subscribe(env.topic_ven_force) 
    clientMqtt.on('connect', function () {
        log.info(dateFormat(new Date(), env.date_format), 'Connected to:', credential.address) 
        resolve() 
    }) 
}) 

let promiseMySQL = new Promise(function (resolve, reject) {
    connection.connect(function () {
        log.info(dateFormat(new Date(), env.date_format), 'Database Connected') 
        resolve() 
    }) 
}) 

Promise.all([promiseMqtt, promiseMySQL]).then(function (values) {
}
) 

//
// MQTT
//
clientMqtt.on('published', (packet, client, cb) => {
    log.debug(dateFormat(new Date(), env.date_format), 'Client', client.id, 'Topic', packet.topic, 'Payload', packet.payload.toString())
    if (packet.topic.indexOf(env.teamtopic) === 0) {
        let reqsql = 'UPDATE esp SET pseudo=? WHERE name=?'
        let params = [JSON.parse(packet.payload).pseudo, JSON.parse(packet.payload).jacket]
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
        }
        log.debug(dateFormat(new Date(), env.date_format), results)
        return parseFloat(results[0].gap)
    }) 
}