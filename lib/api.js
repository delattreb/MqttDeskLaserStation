let env = require(`${rootPath}/config/env`)
let logger = require('./logger')
let request = require('request')

/*------------------------------------------------------------------------------------------------
|  Function updateESP
|  Purpose:  
|
/*-----------------------------------------------------------------------------------------------*/
function updateESP(namep, connectedp) {
    request.post({
        'headers': { 'content-type': 'application/json' },
        'url': 'http://' + env.api.url + ':' + env.api.port + '/updateESP',
        'body': JSON.stringify({
            'name': namep,
            'connected': connectedp
        })
    }, (err, response, body) => {
        if (err) {
            return console.log(err);
        }
        //console.log(JSON.parse(body));
    })

    /*
    function updateESP(name, connected) {
        request.get('http://' + env.api.url + ':' + env.api.port + '/customer', function (err, response, body) {
            if (err) {
                console.log('Request' + err)
                throw err
            }
            console.log(JSON.parse(body))
        })
    /*
        let req = 'SELECT name FROM esp WHERE name=?'
        let params = [name]
        execSQL(req, params, function (results) {
            if (results.length > 0) {
                if (results[0].name.toString() === name) {
                    let req = 'UPDATE esp SET connected=? WHERE name=?'
                    let params = [connected, name]
                    execSQL(req, params, function (results) { })
                }
            } else {
                let req = 'INSERT INTO esp (name, connected, date) VALUES (?, ?, NOW())'
                let params = [name, connected]
                execSQL(req, params, function (results) { })
            }
        })*/
}


/*
request.get('http://127.0.0.1:1337/customer', function (err, response, body) {
    if (err) {
        console.log('Request' + err)
        throw err
    }
    console.log(JSON.parse(body))
})


request.post({
    "headers": { "content-type": "application/json" },
    "url": "http://127.0.0.1:1337/customer",
    "body": JSON.stringify({
        "name": "MyCustomer3",
        "description": "Description of my customer"
    })
}, (err, response, body) => {
    if (err) {
        return console.log(err);
    }
    console.log(JSON.parse(body));
});
*/

module.exports = {
    updateESP
}