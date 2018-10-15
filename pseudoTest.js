let mqtt = require('mqtt');
let env = require('./env');
let credential = require('./credentials');

var options = {
    port: 1884,
    //host: 'mqtt://mycube.dscloud.me',
    clientId: 'SmartPhoneTest'
    //keepalive: 60,
    //reconnectPeriod: 1000,
    //protocolId: 'MQIsdp',
    //protocolVersion: 3,
    //clean: true,
    //encoding: 'utf8'
};

let clientMqtt = mqtt.connect(credential.address, options);
clientMqtt.publish(env.lasertopic, JSON.stringify({ pseudo: "bruno"}));
//clientMqtt.publish(env.lasertopic, '0');
console.log('send message');