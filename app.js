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


var http = require("http");
var path = require("path");
var express = require("express");
var logger = require("morgan");
var bodyParser = require("body-parser");


var app = express();
var publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

app.post("/sendMessage", function (req, res) {
  sendMsg();
  res.end();
});
app.use(function (req, res) {
  res.status(404).render("404");
});

http.createServer(app).listen(3000, function () {
  console.log("Tasks app started.");
});
