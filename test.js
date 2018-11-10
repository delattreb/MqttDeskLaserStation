let request = require('request')


request.get('http://127.0.0.1:1337/customer', function (err, response, body) {
    if (err) {
        console.log('Request' + err)
        throw err
    }
    //console.log(JSON.parse(body))
    let ret = JSON.parse(body)
    for (let i = 0; i < ret.length; i++) {
        console.log(ret[i].name)
    }
})

/*
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
