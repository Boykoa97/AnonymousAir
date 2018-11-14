var express = require('express');
var path= require('path');
var app = express();
var cors = require('cors');
var cookieParser = require('cookie-parser');
const opn = require('opn');
var mysql = require('mysql');
var hbs = require("express-handlebars");

var routes = require('./public/routes/index');

//handlebars setup
app.engine('hbs',hbs({extname: 'hbs', defaultLayout: 'layout', layoutDir: __dirname + "/public/view/layout"}));
app.set('views',path.join(__dirname,'views'))
app.set('view engine','hbs');

//set static content folder location (i.e. where to locate css files, javascript files, and images)
app.use(express.static('public'));

//set up the routes to get referenced in the index.js file
app.use('/',routes);

//launch the app
app.listen(3000)
opn('http://localhost:3000/login', {app:'chrome'})
