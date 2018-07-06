var mqtt = require('mqtt')

//for username and password check the link for setting environment variables in Heroku
var options = {
  port: 15199,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: process.env.mqttUser,
  password: process.env.mqttPass,
};


var client = mqtt.connect('mqtt://m12.cloudmqtt.com', options);

// var url = require('url');

// var http = require("http");
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var session = require('express-session');
require('ejs');
var configDB = require('./config/database.js');
mongoose.connect(configDB.url); // connect to our database

var app = express();
require('./config/passport')(passport);
// set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
app.use(bodyParser()); // get information from html forms


app.set("views", path.resolve(__dirname, "views"));
app.use(express.static(path.join(__dirname, '/')));
app.set("view engine", "ejs");

// required for passport
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' })); // session secret
app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session
require('./app/routes.js')(app, passport, client);
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

// app.set('port', (process.env.PORT || 5000));


app.use(function (req, res) {
  res.status(404).render("404");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});


