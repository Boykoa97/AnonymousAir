var express = require('express');
var router = express.Router();
//var mysql = require("mysql");
var path = require("path");


//Render the admin page into the handlebars file
router.get('/admin', function(req,res,next){
  //retrieve the export from admin.js
  var admin = require(path.join(__dirname,'../queries/admin.js'));
  //a promise is returned so this formats the data into a result set
  var promise = admin.then(function(result){
    console.log(result);
    //send the data into the handlebars file
    res.render('admin',result);
  });
});

//Render the login page into the handlebars file
router.get('/login',function(req,res,next){
  var login = require(path.join(__dirname,'../queries/login.js'));
  var promise = login.then(function(result){
    console.log(result);
    obj= Object.assign({},result,{layout: 'login_layout.hbs'})
    res.render('login',obj);
  });
});

//Render the main page into the handlebars file
router.get('/main',function(req,res,next){
  var main = require(path.join(__dirname,'../queries/main.js'));
  var promise = main.then(function(result){
    console.log(result);
    res.render('main',result);
  });
});

//Render the accountinfo page into the handlebars file
router.get('/accountinfo',function(req,res,next){
  var accountinfo = require(path.join(__dirname,'../queries/accountinfo.js'));
  var promise = accountinfo.then(function(result){
    console.log(result);
    res.render('accountinfo',result);
  });
});

//Render the bookflight page into the handlebars file
router.get('/bookflight',function(req,res,next){
  var bookflight = require(path.join(__dirname,'../queries/bookflight.js'));
  var promise = bookflight.then(function(result){
    console.log(result);
    res.render('bookflight',result);
  });
});

//Render the checkin page into the handlebars file
router.get('/checkin',function(req,res,next){
  var checkin = require(path.join(__dirname,'../queries/checkin.js'));
  var promise = checkin.then(function(result){
    console.log(result);
    res.render('checkin',result);
  });
});

//Render the contact page into the handlebars file
router.get('/contact',function(req,res,next){
  var contact = require(path.join(__dirname,'../queries/contact.js'));
  var promise = contact.then(function(result){
    console.log(result);
    res.render('contact',result);
  });
});

//Render the shoppingcart page into the handlebars file
router.get('/shoppingcart',function(req,res,next){
  var shoppingcart = require(path.join(__dirname,'../queries/shoppingcart.js'));
  var promise = shoppingcart.then(function(result){
    console.log(result);
    res.render('shoppingcart',result);
  });
});

//Render the travelinfo page into the handlebars file
router.get('/travelinfo',function(req,res,next){
  var travelinfo = require(path.join(__dirname,'../queries/travelinfo.js'));
  var promise = travelinfo.then(function(result){
    console.log(result);
    res.render('travelinfo',result);
  });
});

module.exports = router;
