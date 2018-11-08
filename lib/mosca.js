let env = require(`${rootPath}/config/env`)
let mosca = require('mosca')
let fs = require("fs")
let Authorizer = require("mosca/lib/authorizer")
let sql = require('./sql')
let logger = require('./logger')


let moscaserver = new mosca.Server(env.mosca, setup)

/*------------------------------------------------------------------------------------------------
|  Function loadAuthorizer
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function loadAuthorizer(credentialsFile, cb) {
    if (credentialsFile) {
        fs.readFile(credentialsFile, function (err, data) {
            if (err) {
                logger.error('Mosca credentials file not found')
                cb(err)
                return
            }
            var authorizer = new Authorizer()
            try {
                authorizer.users = JSON.parse(data)
                cb(null, authorizer)
            } catch (err) {
                logger.error('Mosca invalid credentials')
                cb(err)
            }
        })
    } else {
        cb(null, null)
    }
}

/*------------------------------------------------------------------------------------------------
|  Function setup
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function setup() {
    loadAuthorizer(env.mosacacredentials, function (err, authorizer) {
        if (err) {
            logger.error('Mosca credentials error')
        }
        if (authorizer) {
            moscaserver.authenticate = authorizer.authenticate
            moscaserver.authorizeSubscribe = authorizer.authorizeSubscribe
            moscaserver.authorizePublish = authorizer.authorizePublish
        }
    })
}

/*------------------------------------------------------------------------------------------------
|  Function Mosca
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
moscaserver.on('ready', function () {
    logger.info('Mosca server is up and running on port ' + env.mosca.port)
})
moscaserver.on('error', function (err) {
    logger.error('Error       ' + err)
})
moscaserver.on('subscribed', function (topic, client) {
    logger.info('Subscribed  ' + client.id + ' ' + topic)
})
moscaserver.on('unsubscribed', function (topic, client) {
    logger.info('Unsubscribed' + client.id + ' ' + topic)
})
moscaserver.on('clientConnected', function (client) {
    logger.info('Connected   ' + client.id)
    sql.updateESP(client.id, true)
})
moscaserver.on('clientDisconnected', function (client) {
    logger.info('Disconnected' + ' ' + client.id)
    sql.updateESP(client.id, false)
})
moscaserver.on('published', publish)
function publish(packet, client, cb) {
    if (typeof client !== 'undefined' && typeof packet !== 'undefined') {
        logger.debug('Client' + ' ' + client.id + ' ' + 'Topic' + ' ' + packet.topic)
        logger.debug(packet.payload.toString())
    }
    // Team Topic
    if (packet.topic.indexOf(env.teamtopic) === 0) {
        sql.updateTeam(packet)
    }
    // Game Topic
    if (packet.topic.indexOf(env.gametopic) === 0) {
        //Get id killed
        sql.updateGame(client, packet)
    }
    // Party topic
    if (packet.topic.indexOf(env.partytopic) === 0) {
    }
    // Start topic
    if (packet.topic.indexOf(env.starttopic) === 0) {
    }
    // Stop topic
    if (packet.topic.indexOf(env.stoptopic) === 0) {
    }
}

module.exports = {
}