const mysql = require("mysql");
const fs = require('fs');
const path = require('path');

//this is just for one query on the page, more can be added
module.exports = function(req){
    //Check security token
    if(req.secure == false)
        return {resetSuccess: false, text: "You do not have permission to do this!"};

    //connect to database
    var connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge',
        multipleStatements: true
    });

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    let sql =   fs.readFileSync(path.join(__dirname,"../ddl/TablesDDL.sql")).toString();
    sql = sql + fs.readFileSync(path.join(__dirname,"../ddl/CustomerDDL.sql")).toString();
    sql = sql + fs.readFileSync(path.join(__dirname,"../ddl/AliasDDL.sql")).toString();
    sql = sql + fs.readFileSync(path.join(__dirname,"../ddl/AirportDDL.sql")).toString();

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

        //Log the result set from the database
        //console.log(result_set);
        connection.end();

        //return the variables you want to see on the HTML page

        //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //can add data manipulation here (i.e. for-loops, calculations,
        // or anything you need to format after obtaining the data from the db)

        return {resetSuccess: true};


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function(err){ //Runs if the promise throws an error
        console.log("Error at SQL query adminReset " + err);
        return {resetSuccess: false};
        connection.end();
    });

    return obj;
};
