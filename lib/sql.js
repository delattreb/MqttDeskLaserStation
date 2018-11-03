let mysql = require('mysql')

let credential = require(`${rootPath}/config/credentials`)
let logger = require('./logger')

let connection = mysql.createConnection(credential.db)
connection.connect(function () {
    logger.info('Database connected ' + credential.db.database + ' on port ' + credential.db.port)
})

/*------------------------------------------------------------------------------------------------
|  Function updateESP
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateESP(name, connected) {
    let req = 'SELECT name FROM esp WHERE name=?'
    let params = [name]
    execSQL(req, params, function (results) {
        if (results.length > 0) {
            if (results[0].name.toString() === name) {
                let req = 'UPDATE esp SET connected=? WHERE name=?'
                let params = [connected, name]
                execSQL(req, params, function (results) { })
            }
        } else {
            let req = 'INSERT INTO esp (name, connected, date) VALUES (?, ?, NOW())'
            let params = [name, connected]
            execSQL(req, params, function (results) { })
        }
    })
}

/*------------------------------------------------------------------------------------------------
|  Function updateTeam
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateTeam(packet) {
    let req = 'UPDATE esp SET pseudo=? WHERE name=?'
    let params = [JSON.parse(packet.payload).pseudo, JSON.parse(packet.payload).jacket]
    execSQL(req, params, function (results) { })
}

/*------------------------------------------------------------------------------------------------
|  Function updateGame
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateGame(client, packet) {
    let req = 'SELECT id, pseudo FROM esp WHERE name=?'
    let params = [client.id]
    execSQL(req, params, function (results) {
        let idkilled = parseInt(results[0].id)
        let pseudo = results[0].pseudo
        logger.debug('Killed' + ' ' + pseudo + ' ' + 'id' + ' ' + idkilled)
        req = 'INSERT INTO histo (killer, killed, target) VALUES (?, ?, ?)'
        params = [JSON.parse(packet.payload).id, idkilled, JSON.parse(packet.payload).target]
        execSQL(req, params, function (results) { })
    })
}

/*------------------------------------------------------------------------------------------------
|  Function execSQL
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function execSQL(req, params, cb) {
    sql = mysql.format(req, params)
    connection.query(sql, function (err, results) {
        if (err) {
            logger.error('MySQL connection error')
            throw err
        }
        return cb(results)
    })
}

module.exports = {
    updateESP,
    updateTeam,
    updateGame
}