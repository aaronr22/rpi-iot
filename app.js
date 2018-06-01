var mqtt = require('mqtt')


var options = {
  port: 15199,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: "azwmqvjr",
  password: "FlMX_5UyUPlH",
};


var client = mqtt.connect('mqtt://m12.cloudmqtt.com', options);

client.on('connect', function () { // When connected

  // subscribe to a topic
  client.subscribe('pi', function () {
    // when a message arrives, do something with it
    client.on('message', function (topic, message, packet) {
      console.log("Received '" + message + "' on '" + topic + "'");
    });
  });

  // publish a message to a topic
  // client.publish('pi', 'IoT test message', function() {
  //   console.log("Message is published");
  //   //client.end(); // Close the connection when published
  // });
});
function sendMsg() {
  client.publish('pi', 'IoT test message', function () {
    console.log("Message is published");
    //client.end(); // Close the connection when published
  });
}



var url = require('url');

var http = require("http");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
require('ejs');


var app = express();
app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/')));
app.set("view engine", "ejs");

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
    res.render("index");
});

app.set('port', (process.env.PORT || 5000));


app.post("/sendMessage", function (req, res) {
  sendMsg();
  var query = url.parse(req.url, true).query;
  var callback = query.callback;
  var t = wrap(JSON.stringify("bats"), callback);
  res.end(t);
});
app.use(function (req, res) {
  res.status(404).render("404");
});

// http.createServer(app).listen(process.env.PORT || 5000, function () {
//   console.log("Tasks app started.");
// });

app.listen(process.env.PORT || 3000, function(){
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function wrap(txt, callb) {
  return callb + "(" + txt + ")";
}