var mysql = require('mysql');
var json = require('../tools/tableData.json');

//TODO: Security stuff

module.exports = function (parameters) {

    switch (parameters.type.toLowerCase()) {
        case 'customer':
            return addCustomer(parameters,json.types[parameters.type.toLowerCase()]).then(function (result) {
                return result;
            });
        case 'flight':
            return addFlight(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{return result});
        default:
            console.log('WE HIT DEFAULT');
    }

}

function addCustomer(parameters) {
    console.log("Inserting new entry into customer!");
    sql = "INSERT INTO Customer VALUES (?,?,?);";

    //TODO - CHECK VALIDITY OF INPUT


    queryResult = getPrimaryKeys('Customer', 'cno').then(function (result) {
        //make sure query didn't fail
        if (result.success === false)
            return {success: false, err: result.err};
        //TODO: Max this better. Check against regex
        if (parameters.cno === '') {
            max = 0;
            //Find maximum Value
            result.data.forEach(function (val) {
                    console.log(parseInt(val.cno));
                if (parseInt(val.cno) > max)
                    max = parseInt(val.cno);
            });
            max++;
            //Force to CHAR(5) size
            let cnoString = '' + max;
            while (cnoString.length < 5) {
                cnoString = '0' + cnoString;
            }
            console.log("CNO STRING: " + cnoString)
            parameters['cno'] = cnoString;
        }

        let insertionValues = [parameters.cno, parameters.username, parameters.password];
        return query(mysql.format(sql, insertionValues)).then(function (result) {

            return {success: result.success, err: result.err, data: result.data, primaryKeyValue: [parameters.cno], inputParameters: parameters}

        }).catch(function (err) {
            console.error(err);
            return {success: false, err: err};

        });

    }).catch(function (err) {
        console.error(err);
        return {success: false, err: err}
    });


    return queryResult;


}

function addFlight(parameters, tableData) {

    //TODO: CHECK VALUES FOR DATES (NO ERROR THROWN FROM SQL)


    console.log("Inserting new entry into Flight!");
    sql = "INSERT INTO Flight VALUES (?,?,?,?,?,?,?,?,?,?,?);";

    tableData.duplicateValues.forEach(v=>{
        parameters.data[v.to] = parameters.data[v.from];
    })
    console.log(parameters);

    let insertionValues = [];

    tableData.fieldData.forEach(e=>{
        insertionValues.push(parameters.data[e.sqlName]);
    })

    primaryKeys = [];
    tableData.primaryKeyAttributes.forEach(e =>{
       primaryKeys.push(parameters.data[e]);
    });

    console.log(insertionValues);

    return query(mysql.format(sql, insertionValues)).then(function (result) {

            return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters}



    }).catch(function (err) {
        console.error(err);
        return {success: false, err: err}
    });


    return queryResult;


}

function getPrimaryKeys(type, keyName) {
    var connection = mysql.createConnection({
        host: 'cosc304.ok.ubc.ca',
        user: 'mspouge',
        password: '13792149',
        database: 'db_mspouge'
    });

//write an sql statement for querying the database

//Create a promise so we can close the connection synchronously
    var promise = new Promise(function (resolve, reject) {

        //send the sql query to the database
        connection.query("SELECT " + keyName + " FROM " + type, (err, result_set) => {
            if (err == null) { //if the query is successful
                resolve(result_set);
            } else { //if the query throws any type of error
                reject(err);
            }
        });
    });

//render the result of the query into the html page and close the connection
    var obj = promise.then(function (result_set) { //Runs if the promise was successful

        //Log the result set from the database
        connection.end();

        //return the variables you want to see on the HTML page

        //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //can add data manipulation here (i.e. for-loops, calculations,
        // or anything you need to format after obtaining the data from the db)

        return {success: true, data: result_set};


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function (err) { //Runs if the promise throws an error
        console.log("Error on SQL request addTuple.getPrimaryKey()\n" + err);
        return {success: false, err: err};
        connection.end();
    });

    return obj;
}

function query(sqlString, params) {

    //connect to database
    var connection = mysql.createConnection({
        host: 'cosc304.ok.ubc.ca',
        user: 'mspouge',
        password: '13792149',
        database: 'db_mspouge'
    });

//write an sql statement for querying the database

//Create a promise so we can close the connection synchronously
    var promise = new Promise(function (resolve, reject) {

        //send the sql query to the database
        connection.query(sqlString, params, (err, result_set) => {
            if (err == null) { //if the query is successful
                resolve(result_set);
            } else { //if the query throws any type of error
                reject(err);
            }
        });
    });

//render the result of the query into the html page and close the connection
    var obj = promise.then(function (result_set) { //Runs if the promise was successful

        //Log the result set from the database
        connection.end();

        //return the variables you want to see on the HTML page

        //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //can add data manipulation here (i.e. for-loops, calculations,
        // or anything you need to format after obtaining the data from the db)

        return {success: true, data: result_set};


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function (err) { //Runs if the promise throws an error
        console.log("Error on SQL request addTuple.query()\n" + err);
        return {success: false, err: err};

        connection.end();
    });

    return obj;
}