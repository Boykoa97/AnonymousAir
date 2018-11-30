var express = require('express');
var router = express.Router();
//var mysql = require("mysql");
var path = require("path");
var fs = require("fs");


//Render the admin page into the handlebars file
router.get('/admin', function(req,res,next){
  //retrieve the export from admin.js
  var admin = require(path.join(__dirname,'../queries/admin.js'));
  //a promise is returned so this formats the data into a result set
  var promise = admin.listCustomer().then(function(result){
    //console.log(result)
    //send the data into the handlebars file
    res.render('admin',result);
  });
});

router.get('/admin/customerTable', function(req,res,next){
    //retrieve the export from admin.js
    var admin = require(path.join(__dirname,'../queries/admin.js'));
    //a promise is returned so this formats the data into a result set
    var promise = admin.listCustomer().then(function(result){
        //console.log(result)
        //send the data into the handlebars file
        res.render('adminTable',result);
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
  var promise = main.main(req.query).then(function(result){
  //  console.log(result);
  // console.log(req.query);

    res.render('main',result);
  })

});

router.get('/main/recommend',function(req,res,next){
  var rec = require(path.join(__dirname,'../queries/recommend.js'));
  console.log(rec);
  console.log("i am in the index right now");
  var obj =rec.recommend().then(result=>{
    //console.log(result);
    res.render('recommend',{params:result,layout:false});
  })


});

router.get('/main/recommendforyou',function(req,res,next){
  var rec = require(path.join(__dirname,'../queries/recommendforyou.js'));
  console.log(rec);
  console.log("i am in the index right now");
  var obj =rec.recommendforyou().then(result=>{
    //console.log(result);
    res.render('recommendforyou',{params:result,layout:false});
  })


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

// //Iterate and generate proper stuff for all the queries
// fs.readdir(path.join(__dirname, '../queries'),function(err,files){
//   if(err){ console.error("Couldn't Parse queries directory.",err); process.exit(1)};
//   files.forEach(function(file,index){
//     //console.log(file);
//     let trimmed = file.toString().substring(0,file.toString().lastIndexOf('.'));
//     console.log(path.join('/queries/',trimmed));
//     router.get(path.join('queries',trimmed), function(req,res,next) {
//         var query = require(path.join(__dirname, '../queries/', file));
//         var promise = query.then(function (result) {
//             res.send({text: 'Completed Reset', success: true});
//         });
//     });
//   });
// });

// router.get('/queries/adminReset',function(req,res,next){
//   var admin = require(path.join(__dirname,'../queries/admin.js'));
//   var promise = admin.adminReset().then(function (result) {
//       res.send(result);
//
//   });
// });

router.get('/view')

module.exports = router;
