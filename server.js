let mysql = require('mysql')
let mosca = require('mosca')
let fs = require("fs");
let Authorizer = require("mosca/lib/authorizer");
let dateFormat = require('dateformat')
let log = require('loglevel')
let env = require('./env')
let credential = require('./credentials')
let connection

log.setDefaultLevel(env.loglevel)

// MySQL
connection = mysql.createConnection(credential.db)

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
                // Update ESP State
                let reqsql = 'UPDATE esp SET connected=? WHERE name=?'
                let params = [connected, name]
                procsql(reqsql, params)
            }
        } else {
            // Insert ESP State
            let reqsql = 'INSERT INTO esp (name, connected, date) VALUES (?, ?, NOW())'
            let params = [name, connected]
            sql = mysql.format(reqsql, params)
            procsql(reqsql, params)
        }
    })
}

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

// Start program
// Accepts the connection if the username and password are valid
var authenticate = function(client, username, password, callback) {
    var authorized = (username === 'dietpi' && password.toString() === 'infected');
    if (authorized) client.user = username;
    callback(null, authorized);
  }
  
  // In this case the client authorized as alice can publish to /users/alice taking
  // the username from the topic and verifing it is the same of the authorized user
  var authorizePublish = function(client, topic, payload, callback) {
    callback(null, client.user == topic.split('/')[1]);
  }
  
  // In this case the client authorized as alice can subscribe to /users/alice taking
  // the username from the topic and verifing it is the same of the authorized user
  var authorizeSubscribe = function(client, topic, callback) {
    callback(null, client.user == topic.split('/')[1]);
  }

function setup() {
    server.authenticate = authenticate;
    server.authorizePublish = authorizePublish;
    server.authorizeSubscribe = authorizeSubscribe;
  }

  function loadAuthorizer(credentialsFile, cb) {
    if (credentialsFile) {
        fs.readFile(credentialsFile, function (err, data) {
            if (err) {
                cb(err);
                return;
            }

            var authorizer = new Authorizer();

            try {
                authorizer.users = JSON.parse(data);
                cb(null, authorizer);
            } catch (err) {
                log.error(dateFormat(new Date(), env.date_format), 'User error')
                cb(err);
            }
        });
    } else {
        cb(null, null);
    }
}

function setup() {
    // setup authorizer
    loadAuthorizer(env.mosacacredentials, function (err, authorizer) {
        if (err) {
            log.error(dateFormat(new Date(), env.date_format), 'Authorizer error')
        }

        if (authorizer) {
            server.authenticate = authorizer.authenticate;
            server.authorizeSubscribe = authorizer.authorizeSubscribe;
            server.authorizePublish = authorizer.authorizePublish;
        }
    });

    // you are good to go!
}

mosca = new mosca.Server(env.mosca, function () {
})
mosca.on('ready', setup); 
//{
//    log.info(dateFormat(new Date(), env.date_format), 'Mosca server is up and running')
//})

mosca.on('subscribed', function (topic, client) {
    log.info(dateFormat(new Date(), env.date_format), 'Subscribed  ', client.id, topic)
})
mosca.on('unsubscribed', function (topic, client) {
    log.info(dateFormat(new Date(), env.date_format), 'Unsubscribed', client.id, topic)
})
mosca.on('clientConnected', function (client) {
    log.info(dateFormat(new Date(), env.date_format), 'Connected   ', client.id)
    updateESPConnected(client.id, true)
})
mosca.on('clientDisconnected', function (client) {
    log.info(dateFormat(new Date(), env.date_format), 'Disconnected', client.id)
    updateESPConnected(client.id, false)
})
mosca.on('published', publish)
function publish(packet, client, cb) {
    if (typeof client !== 'undefined' && typeof packet !== 'undefined') {
        log.debug(dateFormat(new Date(), env.date_format), 'Client', client.id, 'Topic', packet.topic)
        log.debug(dateFormat(new Date(), env.date_format), packet.payload.toString())
    }
    // Team Topic
    if (packet.topic.indexOf(env.teamtopic) === 0) {
        let reqsql = 'UPDATE esp SET pseudo=? WHERE name=?'
        let params = [JSON.parse(packet.payload).pseudo, JSON.parse(packet.payload).jacket]
        mysql.format(reqsql, params)
        procsql(reqsql, params)
    }

    //Game Topic
    if (packet.topic.indexOf(env.gametopic) === 0) {
        //Get id killed
        let reqsql = 'SELECT id, pseudo FROM esp WHERE name=?'
        let params = [client.id]
        mysql.format(reqsql, params)
        sql = mysql.format(reqsql, params);
        connection.query(sql, function (error, results) {
            if (error) {
                log.error(dateFormat(new Date(), env.date_format), 'MySQL connection error')
                throw error
            }
            let idkilled = parseInt(results[0].id)
            let pseudo = results[0].pseudo

            log.error(dateFormat(new Date(), env.date_format), 'Killed', pseudo, 'id', idkilled)

            reqsql = 'INSERT INTO histo (killer, killed, target) VALUES (?, ?, ?)'
            params = [JSON.parse(packet.payload).id, idkilled, JSON.parse(packet.payload).target]
            mysql.format(reqsql, params)
            procsql(reqsql, params)

            //Send pseudo to killed
        });
    }
    if (packet.topic.indexOf(env.partytopic) === 0) {
    }
    if (packet.topic.indexOf(env.starttopic) === 0) {
    }
}
