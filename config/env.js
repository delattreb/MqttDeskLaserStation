let server = require('mosca')

module.exports = {
    // Log Level Configuration Trace:0 Debug:1 Info:2 Warning:3 Error:4 Silent:5
    loglevel: 1,

    // Mosca Server configuration
    mosacacredentials: '/home/dietpi/MqttDeskLaserStation/credentials.json',
    mosca: {
        port: 1884,
        persistence: server.persistence.Memory,
        logger: {
            name: 'MoscaServer',
            //level: 'debug'
        },
        //secure: {
        //    port: 8444,
        //    keyPath: '/home/dietpi/certs/MyKey.key',
        //    certPath: '/home/dietpi/certs/MyCertificate.crt'
        //},
    },

    // MQTT configuration
    mqttoptions: {
        port: 1884,
        clientId: 'Smartphone',
        username: 'dietpi',
        password: 'infected',
    },

    api: {
        url: '127.0.0.1',
        port: 1337
    },

    // Regulation configuration
    partytopic: 'party',
    gametopic: 'game',
    teamtopic: 'team',
    starttopic: 'start',
    stoptopic: 'stop',

    // Date format
    date_format: 'dd/mm/yyyy H:MM:ss',
    mysql_date: 'yyyy-mm-dd H:MM:ss'
}