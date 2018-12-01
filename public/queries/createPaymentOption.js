var mysql = require("mysql");
var jwt = require('jsonwebtoken');
var security = require('./tools/security.js');

//this is just for one query on the page, more can be added
 function addPaymentOption(param,cno){

  //connect to database
  var connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var expDate = 0;
//problem with input expiry dates if this if statement is true
if ( param.newExpMonth > 12 || param.newExpMonth < 0 || param.newExpYear < 0 || param.newExpYear > 99  ) {
  var promise = new Promise(function(resolve,reject){
    reject("Error in expiry data")
  });
}
else {
  var expDate = param.newExpMonth + param.newExpYear;

let sql = 'Insert into PaymentOption Values (?, ?, ?, ?, ?, ?, ?, ?);'
var sqlPrepared = mysql.format(sql, [cno, param.newCardNumb, expDate, param.newCardCCV, param.newBillingAdress, param.billingState, param.countryChar, param.zipCode]);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;

//Create a promise so we can close the connection synchronously

var promise = new Promise(function(resolve,reject){

  //send the sql query to the database
  connection.query(sqlPrepared,(err,result_set)=>{
  //connection.query(sqlPrepared,(err,result_set)=>{
      if(err == null){ //if the query is successful
        console.log(sqlPrepared)
    }
    else{ //if the query throws any type of error
      reject(err);
    }
  });
});
}

//render the result of the query into the html page and close the connection
var obj = promise.then(function(result_set){ //Runs if the promise was successful


  connection.end();

  //return the variables you want to see on the HTML page

  //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //can add data manipulation here (i.e. for-loops, calculations,
  // or anything you need to format after obtaining the data from the db)

  return {title:'Account info Page', response: true};


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


}).catch(function(err){ //Runs if the promise throws an error
  console.log("THE PROMISE THREW --> " + err);
  connection.end();
});

return obj;
}

//add any new query functions you make here...
module.exports = function(param,cno){return addPaymentOption(param,cno)}
module.exports.addPaymentOption = addPaymentOption;
