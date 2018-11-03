var express = require('express');
var app = express();
const opn = require('opn');

app.get('/login',function(req,res){
  res.send('LOGIN')
});

app.get('/main',function(req,res){
  res.sendFile(__dirname + '/view/main.html');
});

app.get('/contact',function(req,res){
  res.sendFile(__dirname + '/view/contact.html');
});

app.get('/bookflight',function(req,res){
  res.sendFile(__dirname + '/view/bookflight.html');
});

app.get('/accountinfo',function(req,res){
  res.sendFile(__dirname + '/view/accountinfo.html');
});

app.get('/shoppingcart',function(req,res){
  res.sendFile(__dirname + '/view/shoppingcart.html');
});

app.get('/checkin',function(req,res){
  res.sendFile(__dirname + '/view/checkin.html');
});

app.get('/travelinfo',function(req,res){
  res.sendFile(__dirname + '/view/travelinfo.html');
});

app.get('/admin',function(req,res){
  res.sendFile(__dirname + '/view/admin.html');
});

app.listen(3000)
opn('http://localhost:3000/login', {app:'firefox'})
