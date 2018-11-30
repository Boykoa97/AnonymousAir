var express = require('express');
var router = express.Router();
//var mysql = require("mysql");
var path = require("path");
var fs = require("fs");
var querystring = require('querystring');


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
    var admin = require(path.join(__dirname,'../queries/admin/adminTable.js'));
    //a promise is returned so this formats the data into a result set
    var promise = admin().then(function(result){
        //console.log(result)
        //send the data into the handlebars file
        res.render('adminTable',result);
    });
});


//Render the the sign up page into the handlebars file
router.get('/login',function(req,res,next){

  obj= Object.assign({},res,{layout: 'login_layout.hbs'})
  res.render('login',obj);

});

//Render the login page into the handlebars file
router.post('/login',function(req,res,next){
  //console.log("I hit the post request");
  var login = require(path.join(__dirname,'../queries/login.js'));
  //var promise = login.validateLogin(req.body).then(function(result){
  var promise = login.validateLogin(req.body).then(function(result){
    //success is boolean where true is a successful login.
    if ( result.success){
      res.redirect('/main');
    }
    else {
      res.send("Log in information is incorrect, try again");
    }
  });
});

//this is for rendering main page after login
router.post('/main', function(req,res,next) {
  var main = require(path.join(__dirname,'../queries/main.js'));
  var promise = main.then(function(result){
    console.log(result);
    res.render('main',result);
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

//Render the flight detail into the handlebars file
router.get('/flightdetail',function(req,res,next){
  var flightdetail = require(path.join(__dirname,'../queries/flightdetail.js'));
  var promise = flightdetail.flightDetailQuery().then(function(result){
    //console.log(result);
    res.render('flightdetail',result);
  });
});

router.get('/queries/addtocart',function(req,res,next){
  var flightdetail = require(path.join(__dirname,'../queries/flightdetail.js'));
  var promise = flightdetail.addtocart().then(function(result){
    res.send(result);
  });
});
// router.get('/queries/adminReset',function(req,res,next){
//   var admin = require(path.join(__dirname,'../queries/admin.js'));
//   var promise = admin.adminReset().then(function (result) {
//       res.send(result);
//
//   });
// });


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


//Render the the sign up page into the handlebars file
router.get('/signup',function(req,res,next){

res.render('signup')

});


router.post('/signup',function(req,res,next){

  var signup = require(path.join(__dirname,'../queries/userSignUpPage.js'));
  var promise = signup.addUser(req.body).then(function(result){
    console.log(req.query);
    // res.render('signup',result);
  });
});



router.get('/admin/add',function(req,res,next){

    var adminAdd = require(path.join(__dirname,'../queries/adminAdd.js'));

    res.render('adminAdd',adminAdd(req.query));

});

router.post('/admin/aliasTable',function(req,res,next){
  var aliasData = require(path.join(__dirname,'../queries/admin/aliasTable.js'));
  aliasData(req.body.cno).then(result =>{

    res.render('aliasTable',{alias: result, layout:false});
  })
})

// //Iterate and generate proper stuff for all the admin queries
//Available under /queries/admin
let getDir = path.join(__dirname,'../queries/admin/');
fs.readdir(getDir,function(err,files){
  if(err){ console.error("Couldn't Parse queries directory.",err); process.exit(1)};
  files.forEach(function(file,index){
    let trimmed = file.toString().substring(0,file.toString().lastIndexOf('.'));
    router.get('/queries/admin/' + trimmed, function(req,res,next) {

        var query = require(path.join(__dirname,"../queries/admin/", file));
        var promise = query(req.query).then(function (result) {
            res.send(result);
        });
    });
  });
});

router.get('/view');


module.exports = router;
