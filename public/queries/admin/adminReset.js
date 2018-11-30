const mysql = require("mysql");
const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');



//this is just for one query on the page, more can be added
module.exports = async function(req){

    //connect to database


//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    sqlFiles= [
        'TablesDDL.sql',
        'AirportDDL.sql',
        'CustomerDDL.sql',
        'FlightDDL.sql',
        'AliasDDL.sql',
        'ExtraDDL.sql',
        'OnFlightExtraDDL.sql',
        'OnFlightDDL0.sql',
        'OnFlightDDL1.sql',
        'OnFlightDDL2.sql',
        'OnFlightDDL3.sql'
    ]
    rootDir = path.join(__dirname,'/../ddl/')
    sqlFiles.forEach((e,i)=>{
        sqlFiles[i] = path.join(rootDir,e);
    })

//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
//     var promise = new Promise(function(resolve,reject){
//
//         //send the sql query to the database
//         value = recursiveRun(0,sqlFiles)
//         if(value === true)
//             resolve(true);
//         else
//             reject(value);
//     });

//render the result of the query into the html page and close the connection
    var obj = await recursiveRun(0,sqlFiles).then(function(result_set){ //Runs if the promise was successful
        console.log('THIS SHOULD BE THE END');
        //Log the result set from the database
        //console.log(result_set);


        //return the variables you want to see on the HTML page

        //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //can add data manipulation here (i.e. for-loops, calculations,
        // or anything you need to format after obtaining the data from the db)

        return {resetSuccess: result_set};


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function(err){ //Runs if the promise throws an error
        console.log("Error at SQL query adminReset " );
        console.log(err);
        return {resetSuccess: false};
    });

    return obj;
};

function promiseChain(index,sqlFiles){

    if(index === sqlFiles.length-1)
        return true;

    var connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge',
        multipleStatements: true
    });
    sqlString = fs.readFileSync(sqlFiles[index]).toString();
    var promise = new Promise((resolve, reject) =>{

        connection.query(sqlString,(err,res)=>{
          if(err==null){
              resolve(index+1)
          }else{
              reject(err)
          }
        })

    })

    return promise.then(i =>{
        connection.end()
        return promiseChain(i,sqlFiles);
    }).catch(err=>{
        console.log(err);
        connection.end()
        return err;
    })
}

async function recursiveRun(index,sqlFiles){
    file = sqlFiles[index];
    var connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge',
        multipleStatements: true
    });
    if(index == sqlFiles.length){
        console.log('Reached the end of file list')
        return true
    }

    var promise = new Promise((resolve, reject) => {
        sql = fs.readFileSync(sqlFiles[index]).toString();
        console.log(file)
        connection.query(sql,(err,res) =>{
            if(err == null){
                resolve(res);
            }else{
                reject(err);
            }
        });
    });

    obj = await promise.then(res=>{
        connection.end()
        return recursiveRun(index+1,sqlFiles)
    }).catch(err=>{
       // throw err;
        console.log("ERROR OCCURED AT FILE: "+sqlFiles[index]);
        console.log(err);
        connection.end()
        return err
    });
    return obj;

}