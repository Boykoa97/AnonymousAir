var mysql = require("mysql");
var jwt = require('jsonwebtoken');
var security = require('./tools/security.js');

//this is just for one query on the page, more can be added
module.exports = function (param) {

    //connect to database
    var connection = mysql.createConnection({
        host: 'cosc304.ok.ubc.ca',
        user: 'mspouge',
        password: '13792149',
        database: 'db_mspouge'
    });

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let sql = 'SELECT * From Customer WHERE username = ? AND password = ?';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
    var promise = new Promise(function (resolve, reject) {

        connection.query(mysql.format(sql, [param.username.toLowerCase(), param.password]), (err, res) => {
            if (err == null) {
                resolve(res);
            } else { //if the query throws any type of error
                reject(err);
            }
        })


    });

    var obj = promise.then(function (result_set) { //Runs if the promise was successful
        connection.end();
        if(result_set.length > 0){
            payload = {
                cno: result_set[0].cno,
                username: result_set[0].username,
                email: result_set[0].email
            }
            token = jwt.sign(payload,security.customerSecret,{expiresIn: 1440});
            return {success: true, token: token}
        }else
            return{success: false}


    }).catch(function (err) { //Runs if the promise throws an error
        console.log("THE PROMISE THREW --> " + err);
        connection.end();
    });

    return obj;
}

