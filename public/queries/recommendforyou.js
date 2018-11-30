var mysql = require("mysql");

//this is just for one query on the page, more can be added
function query1(cno){

  //connect to database
  var connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });

//write an sql statement for querying the database
var today = new Date();
//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
var sql = mysql.format('SELECT \
fid,\
  deptTime \
FROM\
  Flight \
WHERE \
  dept IN (\
    SELECT \
      aid \
    FROM \
      Airport \
    WHERE \
      LOWER(city) IN ( \
        SELECT \
          city \
        FROM \
          ( \
            SELECT \
              city, \
              Flight.deptTime, \
              COUNT(seatNo) \
            FROM \
              OnFlight \
              JOIN Flight \
              JOIN Airport \
              JOIN Alias \
            WHERE \
              OnFlight.fid = Flight.fid \
              AND Airport.aid = Flight.dept \
              AND OnFlight.aliasId = Alias.aliasId \
              AND Alias.cno = ? \
            GROUP BY \
              city, \
              Flight.deptTime \
            ORDER BY \
              COUNT(seatNo) DESC, \
              Flight.deptTime ASC \
            LIMIT \
              1 \
          ) as x \
      ) \
  ) \
  AND arr IN ( \
    SELECT \
      aid \
    FROM \
      Airport \
    WHERE \
      LOWER(city) IN ( \
        SELECT \
          LOWER(city) \
        FROM \
          ( \
            SELECT \
              LOWER(city), \
              COUNT(seatNo),Flight.deptTime \
            FROM \
              OnFlight \
              JOIN Flight \
              JOIN Airport \
              JOIN Alias \
            WHERE \
              OnFlight.fid = Flight.fid \
              AND Airport.aid = Flight.arr \
              AND OnFlight.aliasId = Alias.aliasId \
              AND Alias.cno = ? \
            GROUP BY \
              city, \
              Flight.deptTime \
            ORDER BY \
              COUNT(seatNo) DESC, \
              Flight.deptTime ASC \
            LIMIT \
              1 OFFSET 1 \
          ) AS W \
      )\
  )\
',[cno,cno,today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate()+' ' +today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()]);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
var promise = new Promise(function(resolve,reject){

  //send the sql query to the database
  connection.query(sql,(err,result_set)=>{
      if(err == null){ //if the query is successful
        resolve(result_set);
      }else{ //if the query throws any type of error
        reject(err);
      }
  });
});

//render the result of the query into the html page and close the connection
var obj = promise.then(function(result_set){ //Runs if the promise was successful
  var recomFlights = [];
  for (var i in result_set){
    recomFlights[i] = result_set[i].fid;
  }
if (recomFlights.length === 0) {
  recomFlights[0] = "Hmm, looks like you haven't travelled anywhere with us yet! Why not check out what's popular? ";
}
  //Log the result set from the database
  console.log(recomFlights);
  connection.end();

  //return the variables you want to see on the HTML page

  //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //can add data manipulation here (i.e. for-loops, calculations,
  // or anything you need to format after obtaining the data from the db)

  return {title:'Recommend Page', response: recomFlights};


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


}).catch(function(err){ //Runs if the promise throws an error
  console.log("THE PROMISE THREW --> " + err);
  connection.end();
});

return obj;
}

//add any new query functions you make here...
module.exports.recommendforyou = function(cno){return query1(cno)};
