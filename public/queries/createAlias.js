var mysql = require("mysql");

//this is just for one query on the page, more can be added
function addAlias(param){

  //connect to database
  var connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let sql = 'SELECT * From Alias'
//let sql = 'SELECT * From Customer where username = ?';
//var sqlPrepared = mysql.format(sql, [param.cno])
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
//paramaters = qs.parse(param);
//param.newUser
//Create a promise so we can close the connection synchronously

var promise = new Promise(function(resolve,reject){

  //send the sql query to the database
  connection.query(sql,(err,result_set)=>{
  //connection.query(sqlPrepared,(err,result_set)=>{
      if(err == null){ //if the query is successful
        var idNumb = 1;
        for (i = 0; i < result_set.length; i++ ) {
          idNumb = Number(idNumb) + 1;
          if (param.passportNum == result_set[i].passportNum && param.countryChar == result_set[i].country ) {
            console.log("Passport Already Registered")
            idNumb = -1; //username already exists so don't insert
            break;
          }
        }


        if (idNumb != -1  ) {
          //INSERT INTO Customer VALUES ('00018','CulturalFuneral','Zzts9XTYT7BFheaA');
          let sql2 = 'Insert into Alias Values (\''+ idNumb + '\' , \''  + param.cno + '\', \'' + param.newFirst + '\',' +
                    '\''  + param.newMiddle + '\', \'' + param.newLast  + '\', \'' + param.countryChar'\', \'' + param.passportNum + '\'  );';
          connection.query(sql2,(err,result_set)=>{
              if(err == null){ //if the query is successful)
                console.log(sql2)
              }
              else{ //if the query throws any type of error
              reject(err);
            }
        //resolve(result_set);
      });
      }
    }
    else{ //if the query throws any type of error
      reject(err);
    }
  });
});

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
module.exports = function(param){return addAlias(param)}
module.exports.addAlias = addAlias;
