var mysql = require("mysql");
var planeData = require('./planeData.js');
const host = require('../tools/host.json');

//this is just for one query on the page, more can be added
module.exports = async function(params){

    //connect to database
    var connection = mysql.createConnection(host);

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let sql = 'SELECT Alias.aliasId as aid,aliasFirst,aliasMid,aliasLast,seatNo From Alias,OnFlight WHERE fid = ? AND deptTime = ? AND OnFlight.aliasId = Alias.aliasId ORDER BY seatNo;';
    let sql_extras = 'SELECT Extra.oid as optId, aliasId,  price FROM Reservations, Extra WHERE fid = ? and deptTime = ? and Reservations.oid = Extra.oid';
    sql = mysql.format(sql,[params.fid,params.deptTime]);
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
    var promise = new Promise(function(resolve,reject){

        //send the sql query to the database
        //connection.query(mysql.format(sql,[params.fid, params.deptTime]),(err,result_set)=>{
        connection.query(sql,(err,result_set)=>{
            if(err == null){ //if the query is successful
                resolve(result_set);
            }else{ //if the query throws any type of error
                reject(err);
            }
        });
    });

    var promise_extras = new Promise(function(resolve, reject){

        connection.query(mysql.format(sql_extras,[params.fid,params.deptTime]), (err,results)=>{
            if(err == null){
                resolve(results)
            }else
                reject(err);
        })

    })

//render the result of the query into the html page and close the connection
    var obj = await promise.then(function(manifest){ //Runs if the promise was successful


        //Log the result set from the database
        // console.log(result_set);

        return planeData(params.fid,params.deptTime).then(seatData =>{




            return promise_extras.then(extras=>{

                manifest.forEach(customer=>{
                    customer.price = 0.0
                    extras.forEach(extra=>{
                        console.log(extra)
                        if(customer.aid === extra.aliasId) {
                            console.log('Found match for: ' + customer.aliasFirst + ' ' + customer.aliasLast)
                            if (typeof customer.extras != 'undefined') {
                                customer.extras.push(extra.optId);

                                customer.price += extra.price
                            } else {
                                customer.extras = [];
                                customer.extras.push(extra.optId);
                                customer.price += extra.price
                            }
                        }

                    })




                })
                total = 0;
                for (i = 0; i < manifest.length; i++){
                    customer = manifest[i];
                    seatNoData = getFormattedSeatNo(seatData,customer.seatNo);
                    customer.seatNo = seatNoData.seatNo;
                    customer.type = seatNoData.type;
                    customer.price += seatNoData.price

                    total += customer.price;
                    customer.price = '$ ' + customer.price.toFixed(2);
                }

                console.log(total);
                return {manifest: manifest, total: '$ ' + total.toFixed(2), fid: params.fid, deptTime: params.deptTime}
            });

        });
        //return the variables you want to see on the HTML page

        //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
        //can add data manipulation here (i.e. for-loops, calculations,
        // or anything you need to format after obtaining the data from the db)



        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function(err){ //Runs if the promise throws an error
        console.log("THE PROMISE THREW --> " + err);
        throw(err)
        connection.end();
    });
    return obj;
};

function getFormattedSeatNo(seatData,seatNo){
    response = {seatNo: "N/A", type: "N/A", price: 0}
    seatNo = parseInt(seatNo);

    if(seatNo <= seatData.numFirstClass){

        row = Math.ceil(seatNo/seatData.colFirstClass)
        letter = String.fromCharCode((seatNo - (row-1)*seatData.colFirstClass)+64);

        response.seatNo = row+letter;
        response.type = "FCLASS";
        response.price = seatData.priceFirstClass

    }else if (seatNo <= seatData.numSeats){
        rowF = Math.ceil(seatData.numFirstClass/seatData.colFirstClass);
        row = Math.ceil((seatNo-seatData.numFirstClass)/seatData.colEcon);
        letter = String.fromCharCode((seatNo - (row-1)*seatData.colEcon -seatData.numFirstClass)+64);

        response.seatNo = (rowF+row)+letter;
        response.type = "ECON";
        response.price = seatData.price
    }else{
        response.seatNo = "S"+(seatNo-seatData.numSeats);
        response.type = "STDNG";
        response.price = seatData.priceStanding
    }
    return response;

}
