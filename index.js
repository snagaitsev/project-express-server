//const path = require('path');
const http = require('http')
const express=require("express")
const test=require("./test.js")
const WebSocket = require("ws")
var port = process.env.PORT || 3000;

const app = new express();
const server = http.createServer(app);
server.listen(port);
const wss = new WebSocket.Server({ server });

var topic_1 = "GPU_temperature"
var topic_2 = "SENSOR"
var topic_3 = "LEDONOFF"

var switchState = "F"

var mqtt = require('mqtt')
var client  = mqtt.connect('mqtt://broker.shiftr.io:1883', {username:"cbfab119", password:"7abf0650f5cf7535"})

app.use(express.static('public'));

var y = test("qwerty",function(){
    console.log("Waited 5 sec")
})
console.log(y)
//var app = express();

// app.get('/', (req, res) => {
//     res.sendFile(path.resolve(__dirname, 'public/', 'index.html'));
// });

// on the request to root (localhost:3000/)
/*app.get('/', function (req, res) {
    res.send('<b>My</b> first express http server');
});*/

client.on('connect', function () {
    client.subscribe(topic_1, function (err) {
      if (!err) {
        //client.publish('presence', 'Hello mqtt')
        console.log("MQTT connected, topic " + topic_1)
      }
    })
    client.subscribe(topic_2, function (err) {
        if (!err) {
          //client.publish('presence', 'Hello mqtt')
          console.log("MQTT connected, topic " + topic_2)
        }
    })
    client.subscribe(topic_3, function (err) {
        if (!err) {
          //client.publish('presence', 'Hello mqtt')
          console.log("MQTT connected, topic " + topic_3)
          client.publish(topic_3, switchState)
        }
    })
   
})


//client.subscribe(topic_s,{qos:1});
client.on('message', function (topic, message) {
    // message is Buffer
    console.log("topic: " + topic +  " message: " + message.toString())

    //client.end()
})

// On localhost:3000/welcome
app.get('/welcome', function (req, res) {
    res.send('<b>Hello</b> welcome to my http server made with express');
});

// Change the 404 message modifing the middleware
app.use(function(req, res, next) {
    res.status(404).send("Sorry, that route doesn't exist. Have a nice day :)");
});

// start the server in the port 3000 !
// app.listen(port, function () {
//     console.log('App listening on port:', + port);
// });

wss.on('connection', function connection(ws, req) {
    ws.send(JSON.stringify({
        topic: 'SWITCH1',
        message: switchState
    }));
    
    const ip = req.connection.remoteAddress;
    console.log(ip)
    ws.on('message', function incoming(event) {
        console.log('received: %s', event); 
        var obj = JSON.parse(event); 
        const topic = obj.topic;
        const message = obj.message; 
        if((topic == "SWITCH1") && (message == true)) {
            client.publish(topic_3, "T")
            switchState = 'T'
        } else if((topic == "SWITCH1") && (message == false)) {
            client.publish(topic_3, "F")
            switchState = 'F'
        }
    
    });
    client.on("message", function (topic, message){
        const obj = {
            topic: topic,
            message: message.toString(),
        };
        if(topic == "LEDONOFF"){
            obj.topic = "SWITCH1"
        }
        ws.send(JSON.stringify(obj));
        // ws.send(myObj.message.toString());
    })
   
});

/*server.listen(8081, function () {
    console.log('Websocket listening on port: 8081');
});*/





