var express = require('express');
var router = express.Router();
//var mysql = require("mysql");
var path = require("path");
var fs = require("fs");


//Render the admin page into the handlebars file
router.get('/admin', function (req, res, next) {
    //retrieve the export from admin.js
    var admin = require(path.join(__dirname, '../queries/admin.js'));
    //a promise is returned so this formats the data into a result set
    var promise = admin.listCustomer().then(function (result) {
        //console.log(result)
        //send the data into the handlebars file
        res.render('admin', result);
    });
});


router.get('/admin/customerTable', function (req, res, next) {
    //retrieve the export from admin.js
    var admin = require(path.join(__dirname, '../queries/admin/adminTable.js'));
    //a promise is returned so this formats the data into a result set
    var promise = admin().then(function (result) {
        //console.log(result)
        //send the data into the handlebars file
        res.render('adminTable', result);
    });
});

//Render the login page into the handlebars file
router.get('/login', function (req, res, next) {
    var login = require(path.join(__dirname, '../queries/login.js'));
    var promise = login.then(function (result) {
        console.log(result);
        obj = Object.assign({}, result, {layout: 'login_layout.hbs'})
        res.render('login', obj);
    });
});

//Render the main page into the handlebars file
router.get('/main', function (req, res, next) {
    var main = require(path.join(__dirname, '../queries/main.js'));
    var promise = main.then(function (result) {
        console.log(result);
        res.render('main', result);
    });
});

//Render the flight detail into the handlebars file
router.get('/flightdetail',function(req,res,next){
  var flightdetail = require(path.join(__dirname,'../queries/flightdetail.js'));
  var promise = flightdetail.then(function(result){
    console.log(result);
    res.render('flightdetail',result);
  });
});

//Render the accountinfo page into the handlebars file
router.get('/accountinfo', function (req, res, next) {
    var accountinfo = require(path.join(__dirname, '../queries/accountinfo.js'));
    var promise = accountinfo.then(function (result) {
        console.log(result);
        res.render('accountinfo', result);
    });
});

//Render the bookflight page into the handlebars file
router.get('/bookflight', function (req, res, next) {
    var bookflight = require(path.join(__dirname, '../queries/bookflight.js'));
    var promise = bookflight.then(function (result) {
        console.log(result);
        res.render('bookflight', result);
    });
});

//Render the checkin page into the handlebars file
router.get('/checkin', function (req, res, next) {
    var checkin = require(path.join(__dirname, '../queries/checkin.js'));
    var promise = checkin.then(function (result) {
        console.log(result);
        res.render('checkin', result);
    });
});

//Render the contact page into the handlebars file
router.get('/contact', function (req, res, next) {
    var contact = require(path.join(__dirname, '../queries/contact.js'));
    var promise = contact.then(function (result) {
        console.log(result);
        res.render('contact', result);
    });
});

//Render the shoppingcart page into the handlebars file
router.get('/shoppingcart', function (req, res, next) {
    var shoppingcart = require(path.join(__dirname, '../queries/shoppingcart.js'));
    var promise = shoppingcart.then(function (result) {
        console.log(result);
        res.render('shoppingcart', result);
    });
});

//Render the travelinfo page into the handlebars file
router.get('/travelinfo', function (req, res, next) {
    var travelinfo = require(path.join(__dirname, '../queries/travelinfo.js'));
    var promise = travelinfo.then(function (result) {
        console.log(result);
        res.render('travelinfo', result);
    });
});

router.get('/admin/add', function (req, res, next) {

    var adminAdd = require(path.join(__dirname, '../queries/adminAdd.js'));

    res.render('adminAdd', adminAdd(req.query));

});

router.post('/admin/aliasTable', function (req, res, next) {
    var aliasData = require(path.join(__dirname, '../queries/admin/aliasTable.js'));
    aliasData(req.body.cno).then(result => {

        res.render('aliasTable', {alias: result, layout: false});
    })
})

router.post('/admin/manifestTable',  function (req, res, next) {
    var manifest = require(path.join(__dirname, '../queries/admin/flightManifest.js'));
    var obj = manifest(req.body).then(result => {

        res.render('manifestTable', {param: result, layout: false});

    })
})

router.post('/admin/auth', (req,res,next) => {
    var auth = require('../queries/admin/adminLogin.js');
    response = auth(req.body)
    res.send(response);
});

router.get('/admin/auth', (req,res,next) => {
    res.render('adminAuth')
});



// //Iterate and generate proper stuff for all the admin queries
//Available under /queries/admin
let getDir = path.join(__dirname, '../queries/admin/');
fs.readdir(getDir, function (err, files) {
    if (err) {
        console.error("Couldn't Parse queries directory.", err);
        process.exit(1)
    };
    files.forEach(function (file, index) {
        let trimmed = file.toString().substring(0, file.toString().lastIndexOf('.'));
        router.post('/admin/queries/' + trimmed, function (req, res, next) {

            var query = require(path.join(__dirname, "../queries/admin/", file));
            var promise = query(req.body).then(function (result) {
                res.send(result);
            });
        });
    });
});

router.get('/admin/flightTable', (req, res, next) =>{

    var flightData = require(path.join(__dirname, '../queries/admin/flightTable.js'));
    flightData().then(result => {


        res.render('adminFlightTable', {flight: result});
    })

});


//Render the the sign up page into the handlebars file
router.get('/signup',function(req,res,next){
    var signup = require(path.join(__dirname,'../queries/userSignUpPage.js'));
    var promise = signup(req.query).then(function(result){
        console.log(req.query);
        res.render('signup',result);
    });
});

router.get('/view');

module.exports = router;
