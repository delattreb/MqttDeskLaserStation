let mysql = require('mysql');
let mosca = require('mosca');
let dateFormat = require('dateformat');
let log = require('loglevel');
let env = require('./env');
let credential = require('./credentials');
let connection;

log.setDefaultLevel(env.loglevel);

// MySQL
connection = mysql.createConnection(credential.db);

connection.connect(function () {
    log.info(dateFormat(new Date(), env.date_format), 'Database Connected');
});

function updateESPConnected(name, state) {
    // Check ESP name before insert
    let reqsql = 'SELECT name FROM esp WHERE name=?';
    let params = [name];
    sql = mysql.format(reqsql, params);
    connection.query(sql, function (error, results) {
        if (error) {
            log.error(dateFormat(new Date(), env.date_format), 'MySQL connection error');
            throw error;
        }
        if (results.length > 0) {
            log.debug(dateFormat(new Date(), env.date_format), 'ESP trouvé en BDD ', results[0].name);
            if (results[0].name.toString() === name) {
                // Update ESP State
                log.debug(dateFormat(new Date(), env.date_format), 'ESP Already exists');
                let reqsql = 'UPDATE esp SET connected=? WHERE name=?';
                let params = [state, name];
                procsql(reqsql, params);
            }
        } else {
            // Insert ESP State
            log.debug(dateFormat(new Date(), env.date_format), 'ESP not exists');
            let reqsql = 'INSERT INTO esp (??, ??, ??) VALUES (?, ?, NOW())';
            let params = ['name', 'state', 'date', name, state];
            sql = mysql.format(reqsql, params);
            procsql(reqsql, params);
        }
    });
}

function updateESPState(name, state) {
    let reqsql = 'UPDATE esp SET state=? WHERE name=?';
    let params = [state, name];
    procsql(reqsql, params);
}

function insert_message(name, message) {
    let reqsql = 'INSERT INTO data (name, value, date) VALUES (?, ?, NOW())';
    let params = [name, message];
    procsql(reqsql, params);
}

function procsql(reqsql, params) {
    sql = mysql.format(reqsql, params);
    connection.query(sql, function (error, results) {
        if (error) {
            log.error(dateFormat(new Date(), env.date_format), 'MySQL connection error');
            throw error;
        }
        log.debug(dateFormat(new Date(), env.date_format), results);
    });
}
// Start program
mosca = new mosca.Server(env.mosca, function () {
});

mosca.on('ready', function () {
    log.info(dateFormat(new Date(), env.date_format), 'Mosca server is up and running');
});
mosca.on('subscribed', function (topic, client) {
    log.info(dateFormat(new Date(), env.date_format), 'Subscribed', client.id, topic);
});
mosca.on('unsubscribed', function (topic, client) {
    log.info(dateFormat(new Date(), env.date_format), 'Unsubscribed', client.id, topic);
});
mosca.on('clientConnected', function (client) {
    log.info(dateFormat(new Date(), env.date_format), 'Connected', client.id);
    updateESPConnected(client.id, true);
});
mosca.on('clientDisconnected', function (client) {
    log.info(dateFormat(new Date(), env.date_format), 'Disconnected', client.id);
    updateESPConnected(client.id, false);
});
mosca.on('published', publish);
function publish(packet, client, cb) {
    if (packet.topic.indexOf(env.lasertopic) === 0) {
        log.debug(dateFormat(new Date(), env.date_format), 'client', client.id, 'pub', packet.topic.split(':')[1], 'value', packet.payload.toString());
        let substr = packet.topic.split(':')[1];
        insert_message(substr, packet.payload);
    }
}
