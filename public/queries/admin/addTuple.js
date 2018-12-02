var mysql = require('mysql');
var json = require('../tools/tableData.json');

const host = require('../tools/host.json');

//TODO: Security stuff

module.exports = function (parameters) {

    switch (parameters.type.toLowerCase()) {
        case 'customer':
            return addCustomer(parameters,json.types[parameters.type.toLowerCase()]).then(result=> {return result});
        case 'flight':
            return addFlight(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{return result});
        case 'alias':
            return addAlias(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{ return result});
        case 'airplane':
            return addAirplane(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{ return result});
        case 'airplanemodel':
            return addAirplaneModel(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{ return result});
        case 'airport':
            return addAirport(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{ return result});
        case 'onflight':
            return addOnFlight(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{ return result});
        case 'flightreview':
            return addFlightReview(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{ return result});
        case 'extra':
            return addExtra(parameters,json.types[parameters.type.toLowerCase()]).then(result =>{ return result});
        default:
            console.log('WE HIT DEFAULT');
    }

}

//TODO BRING UP TO SPEED WITH TABLEDATA
function addCustomer(parameters, tableData) {
    console.log("Inserting new entry into customer!");
    sql = "INSERT INTO Customer VALUES (?,?,?,?);";

    //TODO - CHECK VALIDITY OF INPUT


    queryResult = getPrimaryKeys('Customer', 'cno').then(function (result) {
        //make sure query didn't fail
        if (result.success === false)
            return {success: false, err: result.err};
        //TODO: Max this better. Check against regex

            max = 0;
            //Find maximum Value
            result.data.forEach(function (val) {
                    console.log(parseInt(val.cno.substring(1)));
                if (parseInt(val.cno.substring(1)) > max)
                    max = parseInt(val.cno.substring(1));
            });
            max++;
            //Force to CHAR(5) size
            let cnoString = '' + max;
            while (cnoString.length < 4) {
                cnoString = '0' + cnoString;
            }
            cnoString = 'C' + cnoString;
            console.log("CNO STRING: " + cnoString)
            parameters['cno'] = cnoString;


        let insertionValues = [parameters.cno, parameters.data.username, parameters.data.password, parameters.data.email];
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

    return query(mysql.format(sql, insertionValues)).then(function (result) {

            return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters}



    }).catch(function (err) {
        console.error(err);
        return {success: false, err: err}
    });


    return queryResult;


}

function addAlias(parameters, tableData){

    numerateKey = 'aliasId';
    type = 'Alias';

    queryResult = getPrimaryKeys(type, numerateKey).then(function (result) {

        sqlString = "INSERT INTO Alias VALUES (?,?,?,?,?,?,?);"

        //make sure query didn't fail
        if (result.success === false)
            return {success: false, err: result.err};

        max = 0;
        //Find maximum Value
        result.data.forEach(function (val) {
            if (parseInt(val[numerateKey]) > max)
                max = parseInt(val[numerateKey]);
        });
        parameters.data[numerateKey] = ++max;

        let insertionValues = [];

        tableData.fieldData.forEach(e=>{
            insertionValues.push(parameters.data[e.sqlName]);
        })

        primaryKeys = [];
        tableData.primaryKeyAttributes.forEach(e =>{
            primaryKeys.push(parameters.data[e]);
        });

        return query(mysql.format(sqlString, insertionValues)).then(function (result) {

            return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters.data}



        }).catch(function (err) {
            console.error(err);
            return {success: false, err: err}
        });


    })
    return queryResult;


}

function addAirplane(parameters, tableData){

    numerateKey = 'pid';
    type = 'Airplane';

    queryResult = getPrimaryKeys(type, numerateKey).then(function (result) {

        sqlString = "INSERT INTO Airplane VALUES (?,?,?);"

        //make sure query didn't fail
        if (result.success === false)
            return {success: false, err: result.err};

        max = 0;
        //Find maximum Value
        result.data.forEach(function (val) {
            if (parseInt(val[numerateKey]) > max)
                max = parseInt(val[numerateKey]);
        });
        parameters.data[numerateKey] = "" + ++max;

        while(parameters.data[numerateKey].length < 4){
            parameters.data[numerateKey] = '0' + parameters.data[numerateKey];
        }

        parameters.data[numerateKey] = 'P' + parameters.data[numerateKey];

        let insertionValues = [];

        tableData.fieldData.forEach(e=>{
            insertionValues.push(parameters.data[e.sqlName]);
        })

        primaryKeys = [];
        tableData.primaryKeyAttributes.forEach(e =>{
            primaryKeys.push(parameters.data[e]);
        });

        return query(mysql.format(sqlString, insertionValues)).then(function (result) {

            return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters.data}

        }).catch(function (err) {
            console.error(err);
            return {success: false, err: err}
        });


    })
    return queryResult;


}

function addAirplaneModel(parameters, tableData){

    numerateKey = '';
    type = 'AirplaneModel';


        sqlString = "INSERT INTO AirplaneModel VALUES (?,?,?,?,?,?,?,?);"

        //make sure query didn't fail
        //TODO: Max this better. Check against regex

        let insertionValues = [];

        tableData.fieldData.forEach(e=>{
            insertionValues.push(parameters.data[e.sqlName]);
        })

        primaryKeys = [];
        tableData.primaryKeyAttributes.forEach(e =>{
            primaryKeys.push(parameters.data[e]);
        });

        return query(mysql.format(sqlString, insertionValues)).then(function (result) {

            return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters.data}



        }).catch(function (err) {
            console.error(err);
            return {success: false, err: err}
        });




}

function addAirport(parameters, tableData){

    numerateKey = '';
    type = 'Airport';


        sqlString = "INSERT INTO Airport VALUES (?,?,?,?,?,?,?,?);"

        //make sure query didn't fail
        //TODO: Max this better. Check against regex

        let insertionValues = [];

        tableData.fieldData.forEach(e=>{
            insertionValues.push(parameters.data[e.sqlName]);
        })

        primaryKeys = [];
        tableData.primaryKeyAttributes.forEach(e =>{
            primaryKeys.push(parameters.data[e]);
        });

        return query(mysql.format(sqlString, insertionValues)).then(function (result) {

            return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters.data}



        }).catch(function (err) {
            console.error(err);
            return {success: false, err: err}
        });






}

function addOnFlight(parameters, tableData){

    numerateKey = '';
    type = 'OnFlight';


    sqlString = "INSERT INTO OnFlight VALUES (?,?,?,?);"

    //make sure query didn't fail
    //TODO: Max this better. Check against regex

    let insertionValues = [];

    tableData.fieldData.forEach(e=>{
        insertionValues.push(parameters.data[e.sqlName]);
    })

    primaryKeys = [];
    tableData.primaryKeyAttributes.forEach(e =>{
        primaryKeys.push(parameters.data[e]);
    });

    return query(mysql.format(sqlString, insertionValues)).then(function (result) {

        return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters.data}



    }).catch(function (err) {
        console.error(err);
        return {success: false, err: err}
    });






}

function addFlightReview(parameters, tableData){

    numerateKey = 'postDate';
    type = 'OnFlight';

    currentTime = new Date();
    dateString = currentTime.getFullYear() + '-' + currentTime.getMonth() + '-' + currentTime.getDay();

    parameters.data[numerateKey] = dateString;
    sqlString = "INSERT INTO FlightReview VALUES (?,?,?,?,?);"

    //make sure query didn't fail
    //TODO: Max this better. Check against regex

    let insertionValues = [];

    tableData.fieldData.forEach(e=>{
        insertionValues.push(parameters.data[e.sqlName]);
    })

    primaryKeys = [];
    tableData.primaryKeyAttributes.forEach(e =>{
        primaryKeys.push(parameters.data[e]);
    });

    return query(mysql.format(sqlString, insertionValues)).then(function (result) {

        return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters.data}



    }).catch(function (err) {
        console.error(err);
        return {success: false, err: err}
    });






}

function addExtra(parameters, tableData){

    numerateKey = '';
    type = 'Extra';


    sqlString = "INSERT INTO Extra VALUES (?,?,?,?,?,?);"

    //make sure query didn't fail
    //TODO: Max this better. Check against regex

    let insertionValues = [];

    tableData.fieldData.forEach(e=>{
        insertionValues.push(parameters.data[e.sqlName]);
    })

    primaryKeys = [];
    tableData.primaryKeyAttributes.forEach(e =>{
        primaryKeys.push(parameters.data[e]);
    });

    return query(mysql.format(sqlString, insertionValues)).then(function (result) {

        return {success: result.success, err: result.err, data: result.data, primaryKeyValue: primaryKeys, inputParameters: parameters.data}



    }).catch(function (err) {
        console.error(err);
        return {success: false, err: err}
    });






}

function getPrimaryKeys(type, keyName) {
    var connection = mysql.createConnection(host);

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
    var connection = mysql.createConnection(host);

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
