var mysql = require("mysql");

//this is just for one query on the page, more can be added
function addUser(param){

  //connect to database
  var connection = mysql.createConnection({
    host : 'cosc304.ok.ubc.ca',
    user : 'mspouge',
    password : '13792149',
    database : 'db_mspouge'
  });

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
//let sql = 'SELECT * From Customer where username = ?';
let sql = 'SELECT * From Customer';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~;
//paramaters = qs.parse(param);
//param.newUser
//Create a promise so we can close the connection synchronously

var promise = new Promise(function(resolve,reject){

  //send the sql query to the database
  connection.query(sql,(err,result_set)=>{
      if(err == null){ //if the query is successful
        var idNumbString = "";
        var idNumb = 1;
        for (i = 0; i < result_set.length; i++ ) {
          idNumb = Number(idNumb) + 1;
          if (param.newUser == result_set[i].username ) {
            console.log("username found a match")
            idNumb = -1; //username already exists so don't insert
            break;
          }
          if (param.newUser == "undefined" || param.password == "undefined") {
            console.log("username and or password field was sent with empty data");
            idNumb = -1; //got sent bad user data
            break;
          }
        }

        //converting the int id that needs to be added so it fits the fixed 5 char id
        if (idNumb < 10) {
          idNumbString = "C000" + idNumb;
        }
        else if ( idNumb < 100 ) {
          idNumbString = "C00" + idNumb;
        }
        else if ( idNumb < 1000 ) {
            idNumbString = "C0" + idNumb;
        }
        else if ( idNumb < 10000 ) {
          idNumbString = "C" + idNumb;
        }
        else {
          console.log("Error adding, either outbounds on customers or idNumb has a problem " + Number(idNumb));
        }

        if (idNumb != -1 && idNumbString != "" ) {
          //INSERT INTO Customer VALUES ('00018','CulturalFuneral','Zzts9XTYT7BFheaA');
          let sql2 = 'Insert into Customer Values (\''+ idNumbString + '\' , \''  + param.newUser + '\', \'' + param.password + '\');';
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

  return {title:'Sign Up Here', response: true};


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


}).catch(function(err){ //Runs if the promise throws an error
  console.log("THE PROMISE THREW --> " + err);
  connection.end();
});

return obj;
}

//add any new query functions you make here...
module.exports = function(param){return addUser(param)}
module.exports.addUser = addUser;
