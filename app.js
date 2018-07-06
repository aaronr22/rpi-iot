var mqtt = require('mqtt')


var options = {
  port: 15199,
  clientId: 'mqttjs_' + Math.random().toString(16).substr(2, 8),
  username: process.env.mqttUser,
  password: process.env.mqttPass,
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

});
function sendMsg() {
  client.publish('pi', 'IoT test message', function () {
    console.log("Message is published");
    //client.end(); // Close the connection when published
  });
}

//---------------------------------------------------------

var url = require('url');

var http = require("http");
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
require('./app/routes.js')(app, passport);
app.use(bodyParser.urlencoded({ extended: false }));

app.get("/", function (req, res) {
  res.render("index");
});

app.set('port', (process.env.PORT || 5000));


app.get("/sendMessage", function (req, res) {
  sendMsg();
  var query = url.parse(req.url, true).query;
  var callback = query.callback;
  var t = wrap(JSON.stringify("bats"), callback);
  res.end(t);
});

app.use(function (req, res) {
  res.status(404).render("404");
});

app.listen(process.env.PORT || 3000, function () {
  console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
});

function wrap(txt, callb) {
  return callb + "(" + txt + ")";
}



  // =====================================
  // LOGIN ===============================
  // =====================================
  // show the login form
  app.get('/login', function (req, res) {

      // render the page and pass in any flash data if it exists
      res.render('login.ejs', { message: req.flash('loginMessage') });
  });

  // process the login form
  // app.post('/login', do all our passport stuff here);
  app.post('/login', passport.authenticate('local-login', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/login', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
  }));
  // =====================================
  // SIGNUP ==============================
  // =====================================
  // show the signup form
  app.get('/signup', function (req, res) {

      // render the page and pass in any flash data if it exists
      res.render('signup.ejs', { message: req.flash('signupMessage') });
  });

  // process the signup form
  // app.post('/signup', do all our passport stuff here);

  // process the signup form
  app.post('/signup', passport.authenticate('local-signup', {
      successRedirect: '/profile', // redirect to the secure profile section
      failureRedirect: '/signup', // redirect back to the signup page if there is an error
      failureFlash: true // allow flash messages
  }));

  // =====================================
  // PROFILE SECTION =====================
  // =====================================
  // we will want this protected so you have to be logged in to visit
  // we will use route middleware to verify this (the isLoggedIn function)
  app.get('/profile', isLoggedIn, function (req, res) {
      res.render('profile.ejs', {
          user: req.user // get the user out of session and pass to template
      });
  });

  // =====================================
  // LOGOUT ==============================
  // =====================================
  app.get('/logout', function (req, res) {
      req.logout();
      res.redirect('/');
  });

  function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on 
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/');
}