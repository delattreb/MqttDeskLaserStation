let log = require('loglevel')
let dateFormat = require('dateformat')
let env = require(`${rootPath}/config/env`)

log.setDefaultLevel(env.loglevel)

/*------------------------------------------------------------------------------------------------
|  Function trace
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function trace(msg) {
    log.trace(dateFormat(new Date(), env.date_format), 'TRACE   ' + msg)
}

/*------------------------------------------------------------------------------------------------
|  Function debug
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function debug(msg) {
    log.debug(dateFormat(new Date(), env.date_format), 'DEBUG   ' + msg)
}

/*------------------------------------------------------------------------------------------------
|  Function info
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function info(msg) {
    log.info(dateFormat(new Date(), env.date_format), 'INFO    ' + msg)
}

/*------------------------------------------------------------------------------------------------
|  Function warning
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function warning(msg) {
    log.warn(dateFormat(new Date(), env.date_format), 'WARNING ' + msg)
}

/*------------------------------------------------------------------------------------------------
|  Function error
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function error(msg) {
    log.error(dateFormat(new Date(), env.date_format), 'ERROR   ' + msg)
}

module.exports = {
    trace,
    debug,
    info,
    warning,
    error
}