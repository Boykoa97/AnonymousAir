var express = require('express');
var app = express();
var cors = require('cors');
var cookieParser = require('cookie-parser');
const opn = require('opn');

app.use(express.static('public'))


app.get('/login',function(req,res){
  res.sendFile(__dirname + '/public/view/login.html');
});



app.get('/main',function(req,res){
  res.sendFile(__dirname + '/public/view/main.html');
});

app.get('/contact',function(req,res){
  res.sendFile(__dirname + '/public/view/contact.html');
});

app.get('/bookflight',function(req,res){
  res.sendFile(__dirname + '/public/view/bookflight.html');
});

app.get('/accountinfo',function(req,res){
  res.sendFile(__dirname + '/public/view/accountinfo.html');
});

app.get('/shoppingcart',function(req,res){
  res.sendFile(__dirname + '/public/view/shoppingcart.html');
});

app.get('/checkin',function(req,res){
  res.sendFile(__dirname + '/public/view/checkin.html');
});

app.get('/travelinfo',function(req,res){
  res.sendFile(__dirname + '/public/view/travelinfo.html');
});

app.get('/admin',function(req,res){
  res.sendFile(__dirname + '/public/view/admin.html');
});

app.listen(3000)
opn('http://localhost:3000/login', {app:'chrome'})
