
// Configuration file
let log = require('loglevel')
let server = require('mosca')

module.exports = {
    // Log Level Configuration
    loglevel: log.levels.INFO,

    // Mosca Server configuration
    mosca: {
        port: 1884,
        persistence: server.persistence.Memory
    },
      // regulation configuration
    lasertopic: 'laser',
    gametopic: 'game',
    date_format: "dd/mm/yyyy H:MM:ss",
    mysql_date: "yyyy-mm-dd H:MM:ss"
}