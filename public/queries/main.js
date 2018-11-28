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
var dept2 = param.departure;
var facRec = Boolean(param.facRec == "true");
var secBypass = Boolean(param.secBypass == "true");
var onFlightMeals = Boolean(param.onFlightMeals == "true");
var currEx = Boolean(param.currEx == "true");
var fakeId = Boolean(param.fakeId == "true");
console.log(dept);
console.log(arr);
console.log(date);
console.log(dept2);
console.log(facRec);
console.log(secBypass);
console.log(onFlightMeals);
console.log(currEx);
console.log(fakeId);

var group = [];
var i = 0;
if (facRec == true){
  console.log("this sucks");
group[i] = 1;
i= i+1;
}
if (secBypass == true ){
  console.log("this sucks");
  group[i] = 2;
  i = i+1;
}
if (onFlightMeals == true ){
  console.log("this sucks");
  group[i] = 3;
  i = i +1;
}
if (currEx == true ){
  console.log("this sucks");
  group[i] = 4;
  i = i+1;
}
if (fakeId == true ){
  console.log("this sucks");
  group[i] =5;
  i = i+1
}

console.log(group);
if (facRec != null || secBypass != null|| onFlightMeals != null|| currEx != null|| fakeId!= null){

}
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
console.log(dateNew[0]);
console.log(dateNew[1]);
console.log(dateNew[2]);

var sql1 = mysql.format('SELECT fid,price FROM Flight WHERE dept IN (SELECT aid FROM Airport WHERE \
LOWER(city) = LOWER(?)) AND arr IN (SELECT aid FROM Airport WHERE LOWER(city) = LOWER(?)) AND Month(deptTime) = Month(?) AND Year(deptTime) = Year(?) AND Day(deptTime) = Day(?)',[dept,arr,ddlDate,ddlDate,ddlDate]);
var sql3 = mysql.format("SELECT fid FROM Flight NATURAL JOIN OnFlightExtra WHERE dept IN (SELECT aid FROM Airport WHERE \
LOWER(city) = LOWER(?)) AND Month(deptTime) = ? AND Day(deptTime) = ? AND Year(deptTime) = ? \
GROUP BY fid HAVING COUNT(oid) = ? AND SUM(oid) = ?",[dept2, parseInt(dateNew[0],10), parseInt(dateNew[1],10), dateNew[2], group.length, group.reduce((a, b) => a + b, 0)]);
var sql2 =  mysql.format('SELECT Month(deptTime), Day(deptTime), Year(deptTime) FROM OnFlightExtra NATURAL JOIN Flight');
//var sql3 = "INSERT INTO OnFlightExtra VALUES ('3','WS0314','2019-01-01 14:55:00')";
//var flightLoc = param.desiredLocation;
//console.log(window.location.href);
//console.log(flightLoc);
//Create a promise so we can close the connection synchronously
if (arr!= null){
  var sql = sql1;
}
else {
  var sql = sql3;
}
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
  console.log(res2);
  console.log()
  connection.end();
  if (isEmpty(res2)){
    var spit = ('Sorry, no flights available!');
  }
  if (dept == null){
    console.log("this is a whole bunch of nothing");
    var spit = "";
  }
  else{
    var spit = [];
    for(var i in res2){
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
