// Configuration file
let log = require('loglevel')
let server = require('mosca')

module.exports = {
    // Log Level Configuration
    loglevel: log.levels.DEBUG,
    mqttport: 1884,

    // Mosca Server configuration
    mosca: {
        port: this.mqttport,
        persistence: server.persistence.Memory,
        secure: {
            keyPath: "/home/dietpi/certs/MyKey.key",
            certPath: "/home/dietpi/certs/MyCertificate.crt"
        }
    },

    // MQTT regulation
    mqttoptions: {
        port: this.mqttport,
        clientId: 'Smartphone'
    },

    // Regulation configuration
    partytopic: 'party',
    gametopic: 'game',
    teamtopic: 'team',
    starttopic: 'start',
    date_format: "dd/mm/yyyy H:MM:ss",
    mysql_date: "yyyy-mm-dd H:MM:ss"
}