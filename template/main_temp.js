
var mysql = require("mysql");

//just one query on the main page, more can be added
function main_query1(){
  //Beacuse this function gets recalled we don't need to create a connection every time the promise is run
  var connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });

let sql = 'SELECT * From Airport';

var promise = new Promise(function(resolve,reject){

  //open a new connection everytime the promise is called
  /*connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });*/

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
  console.log(res2);
  connection.end();
  return {title:'The Main Page',response: res2[0].name ,condition: false};


// catch any error from the sql query (and close the connection)
}).catch(function(err){
  console.log("I AM ERROR: " + err);
  connection.end();
});


return obj;
}



module.exports = main_query1();
