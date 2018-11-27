var mysql = require("mysql");

//this is just for one query on the page, more can be added
function validateLogin(param){

  //connect to database
  var connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let sql = 'SELECT * From Customer';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var success = false;
//Create a promise so we can close the connection synchronously
var promise = new Promise(function(resolve,reject){

  let isEmpty = true;
  for(var key in param) {
      if(param.hasOwnProperty(key))
          isEmpty = false;
  }
  if(isEmpty)
    resolve( {title: "test"});

  //send the sql query to the database
  connection.query(sql,(err,result_set)=>{
      if(err == null){ //if the query is successful
        for (i = 0; i < result_set.length; i++ ) {
            var usernameAtRowI = String(result_set[i].username).toLowerCase()
            var passwordAtRowI = String(result_set[i].password).toLowerCase()
            if (String(param.username).toLowerCase() == usernameAtRowI ) {
              if (String(param.password).toLowerCase() == passwordAtRowI){
                console.log("successful login")
                resolve("success");
                break;
              }
            }
            if (param.newUser == "undefined" || param.password == "undefined") {
              console.log("username and or password field was sent with empty data");  //got sent bad user data
              break;
            }

          }
          resolve("fail");
      }else{ //if the query throws any type of error
        reject(err);
      }
  });
});

//render the result of the query into the html page and close the connection
var obj = promise.then(function(result_set){ //Runs if the promise was successful
  //Log the result set from the database
  //console.log("this is result set " + result_set);
  connection.end();

  //return the variables you want to see on the HTML page

  //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //can add data manipulation here (i.e. for-loops, calculations,
  // or anything you need to format after obtaining the data from the db)

  if(result_set == "success") {
    return {success:true}
  }
  else {
    return {success:false}
  }


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


}).catch(function(err){ //Runs if the promise throws an error
  console.log("THE PROMISE THREW --> " + err);
  connection.end();
});

return obj;
//return success;
}

//add any new query functions you make here...
module.exports = function(param){return validateLogin(param)}
module.exports.validateLogin = validateLogin;
