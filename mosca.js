let env = require(`${rootPath}/env`);
let dateFormat = require('dateformat')
let mosca = require('mosca')
let fs = require("fs")
let Authorizer = require("mosca/lib/authorizer")
let sql = require('./sql')

let moscaserver = new mosca.Server(env.mosca, setup)

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
                cb(err);
            }
        });
    } else {
        cb(null, null);
    }
}

function setup() {
    loadAuthorizer(env.mosacacredentials, function (err, authorizer) {
        if (err) {
            // handle error here
        }
        if (authorizer) {
            moscaserver.authenticate = authorizer.authenticate;
            moscaserver.authorizeSubscribe = authorizer.authorizeSubscribe;
            moscaserver.authorizePublish = authorizer.authorizePublish;
        }
    });
}

moscaserver.on('ready', function () {
    log.info(dateFormat(new Date(), env.date_format), 'Mosca server is up and running')
})
moscaserver.on('error', function (err) {
    log.info(dateFormat(new Date(), env.date_format), 'Error       ', err)
})
moscaserver.on('subscribed', function (topic, client) {
    log.info(dateFormat(new Date(), env.date_format), 'Subscribed  ', client.id, topic)
})
moscaserver.on('unsubscribed', function (topic, client) {
    log.info(dateFormat(new Date(), env.date_format), 'Unsubscribed', client.id, topic)
})
moscaserver.on('clientConnected', function (client) {
    log.info(dateFormat(new Date(), env.date_format), 'Connected   ', client.id)
    sql.updateESPConnected(client.id, true)
})
moscaserver.on('clientDisconnected', function (client) {
    log.info(dateFormat(new Date(), env.date_format), 'Disconnected', client.id)
    sql.updateESPConnected(client.id, false)
})
moscaserver.on('published', publish)
function publish(packet, client, cb) {
    if (typeof client !== 'undefined' && typeof packet !== 'undefined') {
        log.debug(dateFormat(new Date(), env.date_format), 'Client', client.id, 'Topic', packet.topic)
        log.debug(dateFormat(new Date(), env.date_format), packet.payload.toString())
    }
    // Team Topic
    if (packet.topic.indexOf(env.teamtopic) === 0) {
        sql.updateESP(packet);
    }

    //Game Topic
    if (packet.topic.indexOf(env.gametopic) === 0) {
        //Get id killed
        sql.updateKilled(client, packet);
    }
    if (packet.topic.indexOf(env.partytopic) === 0) {
    }
    if (packet.topic.indexOf(env.starttopic) === 0) {
    }
}

module.exports = {
}