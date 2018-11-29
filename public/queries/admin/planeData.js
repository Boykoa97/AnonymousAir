var mysql = require("mysql");

//this is just for one query on the page, more can be added
module.exports = function(fid,deptTime){

    //connect to database
    var connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge'
    });

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let sql = 'SELECT numSeats, numFirstClass, numStanding,colFirstClass,colEcon, priceFirstClass, price, priceStanding From AirplaneModel,Airplane,Flight '
            + 'WHERE Flight.fid = ? AND Flight.deptTime = ? AND Flight.pid = Airplane.pid AND AirplaneModel.model = Airplane.model';

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
    var promise = new Promise(function(resolve,reject){

        //send the sql query to the database
        connection.query(mysql.format(sql,[fid,deptTime]),(err,result_set)=>{
            if(err == null){ //if the query is successful
                resolve(result_set);
            }else{ //if the query throws any type of error
                reject(err);
            }
        });
    });

//render the result of the query into the html page and close the connection
    var obj = promise.then(function(result_set){ //Runs if the promise was successful

        //Log the result set from the database
        // console.log(result_set);
        connection.end();

        //return the variables you want to see on the HTML page

        //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //can add data manipulation here (i.e. for-loops, calculations,
        // or anything you need to format after obtaining the data from the db)

        return result_set[0];


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function(err){ //Runs if the promise throws an error
        console.log("THE PROMISE THREW --> " + err);
        connection.end();
    });

    return obj;
};
