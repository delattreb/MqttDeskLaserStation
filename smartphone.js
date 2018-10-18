let mqtt = require('mqtt')
let env = require('./env')
let credential = require('./credentials')

let emiter = '84:F3:EB:17:E0:46'
var options = {
    port: 1884,
    clientId: emiter
}
let clientMqtt = mqtt.connect(credential.address, options)
//clientMqtt.publish(env.teamtopic, JSON.stringify({ jacket: "84:F3:EB:17:E0:46", r: "100", g: "101", b: "102", lum: "50", pseudo: "oneshoot", id: "12" }))
clientMqtt.publish(env.gametopic, JSON.stringify({ id: "12", target: "2" }))
//clientMqtt.publish(env.partytopic, JSON.stringify({ poptime: "8", start: "9" }))
//clientMqtt.publish(env.starttopic, JSON.stringify({ go: "1" }))
//clientMqtt.publish(env.starttopic, JSON.stringify({ go: "0" }))
console.log('Message send')
