// Configuration file
let log = require('loglevel')
let server = require('mosca')

module.exports = {
    // Log Level Configuration
    loglevel: log.levels.DEBUG,

    // Mosca Server configuration
    mosacacredentials: "/home/dietpi/MqttDeskLaserStation/credentials.json",
    mosca: {
        port: 1884,
        persistence: server.persistence.Memory,
        //secure: {
        //    keyPath: '/home/dietpi/certs/MyKey.key',
        //    certPath: '/home/dietpi/certs/MyCertificate.crt'
        //},
        logger: {
            name: 'MoscaServer',
            level: 'debug'
        },
    },

    // MQTT configuration
    mqttoptions: {
        port: 1884,
        clientId: 'Smartphone',
        username: "dietpi",
        password: "infected"
    },

    // Regulation configuration
    partytopic: 'party',
    gametopic: 'game',
    teamtopic: 'team',
    starttopic: 'start',

    // Date format
    date_format: "dd/mm/yyyy H:MM:ss",
    mysql_date: "yyyy-mm-dd H:MM:ss"
}