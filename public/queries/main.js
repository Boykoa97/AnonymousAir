var mysql = require("mysql");

//just one query on the main page, more can be added
function main_query1(param){
  //Beacuse this function gets recalled we don't need to create a connection every time the promise is run
  var connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });
var dept = param.departure;
var arr = param.arrival;
console.log(param.departure);
console.log(param.arrival); 


let sql = 'SELECT * From Airport';
//var flightLoc = param.desiredLocation;
//console.log(window.location.href);
//console.log(flightLoc);
//Create a promise so we can close the connection synchronously
var promise = new Promise(function(resolve,reject){

  //send an sql query to the database
  connection.query(sql,(err,res2)=>{
      if(err == null){
        resolve(res2);
      }else{
        reject(err);
      }
  });
});

//render the result of the query into the html page (main.hbs) (and close the connection)
var obj = promise.then(function(res2){
  //console.log(res2);
  connection.end();
  //returns the variables to the index.js file, which renders the variables in this object to the main.hbs file (notice how in the main.hbs file in curly brackets the variables have the same name as these)
  return {title:'The Main Page', response: res2[1].name};


// catch any error from the sql query (and close the connection)
}).catch(function(err){
  console.log("THE PROMISE THREW --> " + err);
  connection.end();
});


return obj;
}

module.exports = function(param){return main_query1(param);}
