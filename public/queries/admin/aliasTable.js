var mysql = require("mysql");
const host = require('../tools/host.json');

//this is just for one query on the page, more can be added
module.exports = function(customerNo){
    console.log("CNO: " + customerNo);
    //connect to database
    var connection = mysql.createConnection(host);

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let sql = 'SELECT * From Alias WHERE cno = ? ORDER BY aliasId';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
    var promise = new Promise(function(resolve,reject){

        //send the sql query to the database
        connection.query(mysql.format(sql,[customerNo]),(err,result_set)=>{
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

        return result_set


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function(err){ //Runs if the promise throws an error
        console.log("THE PROMISE THREW --> " + err);
        connection.end();
    });

    return obj;
};
