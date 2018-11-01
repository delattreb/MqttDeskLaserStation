let mqtt = require('mqtt')
let env = require('./env')
let credential = require('./credentials')

let clientMqtt = mqtt.connect(credential.address, env.mqttoptions)

clientMqtt.publish(env.teamtopic, JSON.stringify({ jacket: "5C:CF:7F:6B:45:C6", r: "100", g: "0", b: "0", lum: "50", pseudo: "oneshoot", id: "12" }))
//clientMqtt.publish(env.gametopic, JSON.stringify({ id: "12", target: "2" }))
//clientMqtt.publish(env.partytopic, JSON.stringify({ poptime: "8", start: "9" }))
//clientMqtt.publish(env.starttopic, JSON.stringify({ go: "1" }))
//clientMqtt.publish(env.starttopic, JSON.stringify({ go: "0" }))
console.log('Message send')
