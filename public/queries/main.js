var mysql = require("mysql");

function isEmpty(obj) {
    for(var key in obj) {
        if(obj.hasOwnProperty(key))
            return false;
    }
    return true;
}

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
var date = param.date;
if (date != null)
{
    var dateNew = date.split("/");
  }
else dateNew = [0000,00,00];
var ddlDate = dateNew[2] +"-"+dateNew[0] + "-" + dateNew[1];
console.log(param.departure);
console.log(param.arrival);
console.log(param.date);
console.log(dateNew);
console.log(ddlDate);


var sql1 = mysql.format('SELECT fid,price FROM Flight WHERE dept IN (SELECT aid FROM Airport WHERE \
city = ?) AND arr IN (SELECT aid FROM Airport WHERE city = ?) AND Month(deptTime) = Month(?) AND Year(deptTime) = Year(?)',[dept,arr,ddlDate,ddlDate]);
let sql = 'SELECT * From Airport';
//var flightLoc = param.desiredLocation;
//console.log(window.location.href);
//console.log(flightLoc);
//Create a promise so we can close the connection synchronously
var promise = new Promise(function(resolve,reject){

  //send an sql query to the database
  connection.query(sql1,(err,res2)=>{
    
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
  if (isEmpty(res2)){
    var spit = ('Sorry, no flights available!');
  }
  if (dept == null && arr == null){
    console.log("this is a whole bunch of nothing");
    var spit = "";
  }
  else{
    for(var i in res2){
      var spit = []
      spit[i] = res2[i].fid
    }

  }

  //returns the variables to the index.js file, which renders the variables in this object to the main.hbs file (notice how in the main.hbs file in curly brackets the variables have the same name as these)
  return {title:'The Main Page', response: spit};
//  while(res2.next)


// catch any error from the sql query (and close the connection)
}).catch(function(err){
  console.log("THE PROMISE THREW --> " + err);
  connection.end();
});


return obj;
}
module.exports = function(param){return main_query1(param);}
