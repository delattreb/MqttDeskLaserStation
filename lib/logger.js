let log = require('loglevel')
let dateFormat = require('dateformat')
let env = require(`${rootPath}/config/env`)

log.setDefaultLevel(env.loglevel)

/*------------------------------------------------------------------------------------------------
|  Function trace
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function trace(value) {
    log.trace(dateFormat(new Date(), env.date_format), 'TRACE   ' + value)
}

/*------------------------------------------------------------------------------------------------
|  Function debug
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function debug(value) {
    log.debug(dateFormat(new Date(), env.date_format), 'DEBUG   ' + value)
}

/*------------------------------------------------------------------------------------------------
|  Function info
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function info(value) {
    log.info(dateFormat(new Date(), env.date_format), 'INFO    ' + value)
}

/*------------------------------------------------------------------------------------------------
|  Function warning
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function warning(value) {
    log.warn(dateFormat(new Date(), env.date_format), 'WARNING ' + value)
}

/*------------------------------------------------------------------------------------------------
|  Function error
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function error(value) {
    log.error(dateFormat(new Date(), env.date_format), 'ERROR   ' + value)
}

module.exports = {
    debug,
    info,
    warning,
    error
}