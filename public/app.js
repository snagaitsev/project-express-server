// Plotting script
var time = new Date();
var temperature = 0.0;
var sensor_read = 0.0;

var data = [{
    x: [time],
    y: [sensor_read],
    mode: 'lines',
    line: {color: '#80CAF6'}
}]

Plotly.newPlot('graph', data);

var cnt = 0;

var interval = setInterval(function() {

    var time = new Date();

    var update = {
    x:  [[time]],
    y: [[sensor_read]]
    }

    var olderTime = time.setMinutes(time.getMinutes() - 1);
    var futureTime = time.setMinutes(time.getMinutes() + 1);

    var minuteView = {
        xaxis: {
        type: 'date',
        range: [olderTime,futureTime]
        }
    };

    Plotly.relayout('graph', minuteView);
    Plotly.extendTraces('graph', update, [0])

    if(++cnt === 100) clearInterval(interval);
}, 1000);

//Websocket script
var uri1 = window.location;
var uri = window.location.href.split('://');
//var uri2 = uri[1].split(":")
var wslead = 'ws://';
    if (uri[1] == 'https') wslead = 'wss://';
    if (uri[1].indexOf('/') < (uri[1].length - 1))
    {
        wsUri = wslead + uri[1];
    }
    else
    {
        wsUri = wslead + uri[1];
    }
var WSocket = new WebSocket(wsUri);
//var WSocket = new WebSocket("ws://localhost:3000/");

WSocket.onopen = function connection() {
    //WSocket.onopen = function (/*event*/) {
        console.log("ws connection open")
        WSocket.send(JSON.stringify({
            topic: 'IP',
            message: uri1.toString(),})
        ); 
    //};
};

WSocket.onmessage = function incoming(event) {
    const obj = JSON.parse(event.data);
    const topic = obj.topic;
    const message = obj.message;
    //console.log("topic: " + topic.toString() + "; Message: " + message);
    if (topic == "GPU_temperature"){
        document.getElementById("demo1").innerHTML = message;
        temperature = message;    
    } else if (topic == "SENSOR") {
        sensor_read = message;
    } else if (topic == "SWITCH1") {
        const elem = $('#myonoffswitch');
        let checked = false;
        if (message == 'T') {
            checked = true;
        }
        elem.prop('checked', checked);
    }
    
};

$(document).ready(() => {
    $('#myonoffswitch').change(function() {
        let checked = false;
        if ($(this).is(':checked')) {
            checked = true;
        }

        WSocket.send(JSON.stringify({
            topic: 'SWITCH1',
            message: checked,
        }));
    });
});
