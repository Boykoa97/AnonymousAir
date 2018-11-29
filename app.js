var express = require('express');
var path= require('path');
var app = express();
var cors = require('cors');
var cookieParser = require('cookie-parser');
const opn = require('opn');
var mysql = require('mysql');
var hbs = require("express-handlebars");
var bodyParser = require('body-parser')
var security = require('./public/queries/tools/security.js');

var routes = require('./public/routes/index');

//handlebars setup
app.set('views',path.join(__dirname,'views'));
app.engine('hbs',hbs({extname: 'hbs', defaultLayout: 'navbar_layout', layoutDir: __dirname + "/public/views/layout"}));

app.set('view engine','hbs');
app.set('Secret',security.adminSecret);

//set static content folder location (i.e. where to locate css files, javascript files, and images)
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
//set up the routes to get referenced in the index.js file
app.use('/',routes);

//register partials for HandleBars
//launch the app
app.listen(3000)
//opn('http://localhost:3000/login', {app:'chrome'});
