let mysql = require('mysql')
let dateFormat = require('dateformat')
let credential = require(`${rootPath}/config/credentials`);
let env = require(`${rootPath}/config/env`);

let connection = mysql.createConnection(credential.db)
connection.connect(function () {
    log.info(dateFormat(new Date(), env.date_format), 'Database Connected')
})

function updateESPConnected(name, connected) {
    // Check ESP name before insert
    let reqsql = 'SELECT name FROM esp WHERE name=?'
    let params = [name]
    sql = mysql.format(reqsql, params)
    connection.query(sql, function (error, results) {
        if (error) {
            log.error(dateFormat(new Date(), env.date_format), 'MySQL connection error')
            throw error
        }
        if (results.length > 0) {
            if (results[0].name.toString() === name) {
                let reqsql = 'UPDATE esp SET connected=? WHERE name=?'
                let params = [connected, name]
                procsql(reqsql, params)
            }
        } else {
            let reqsql = 'INSERT INTO esp (name, connected, date) VALUES (?, ?, NOW())'
            let params = [name, connected]
            procsql(reqsql, params)
        }
    })
}

/*
function get_info(data, callback){
      var sql = "SELECT a from b where info = data";
      connection.query(sql, function(err, results){
            if (err){ 
              throw err;
            }
            return callback(results[0].objid);
    }
}

var stuff_i_want = '';
 get_info(parm, function(result){
    stuff_i_want = result;
 });
 */

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

function updateESP(packet) {
    let reqsql = 'UPDATE esp SET pseudo=? WHERE name=?';
    let params = [JSON.parse(packet.payload).pseudo, JSON.parse(packet.payload).jacket];
    procsql(reqsql, params);
}

function updateKilled(client, packet) {
    let reqsql = 'SELECT id, pseudo FROM esp WHERE name=?';
    let params = [client.id];
    mysql.format(reqsql, params);
    let req = mysql.format(reqsql, params);
    sql.connection.query(req, function (error, results) {
        if (error) {
            log.error(dateFormat(new Date(), env.date_format), 'MySQL connection error');
            throw error;
        }
        let idkilled = parseInt(results[0].id);
        let pseudo = results[0].pseudo;
        log.error(dateFormat(new Date(), env.date_format), 'Killed', pseudo, 'id', idkilled);
        reqsql = 'INSERT INTO histo (killer, killed, target) VALUES (?, ?, ?)';
        params = [JSON.parse(packet.payload).id, idkilled, JSON.parse(packet.payload).target];
        sql.procsql(reqsql, params);
    });
}

module.exports = {
    /*
    close: require('./protos/close-ticket'),
    retrieve: require('./protos/get-messages'),
    message: require('./protos/new-message'),
    new: require('./protos/new-ticket'),
   */
    updateESPConnected,
    updateESP,
    updateKilled
}