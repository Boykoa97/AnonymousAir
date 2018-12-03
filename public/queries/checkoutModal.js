var mysql = require("mysql");
var host = require('./tools/host.json');
var aliasTable = require('./admin/aliasTable.js');
var paymentData = require('./paymentData.js');
var seatData = require('./admin/planeData.js')

//this is just for one query on the page, more can be added
module.exports = function (cno){

    //connect to database
    var connection = mysql.createConnection(host);

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
    let sql = 'SELECT numStanding,Flight.*,Cart.*, Extra.optionTitle, Extra.price as ExtraPrice From Cart natural ' +
        'join Flight natural join Airplane natural join AirplaneModel, Extra Where Extra.oid = Cart.oid AND cno="'+cno+'"';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
    var promise = new Promise(async function(resolve,reject){

        //send the sql query to the database
        var obj = await connection.query(sql,(err,result_set)=>{
            if(err == null){ //if the query is successful
                resolve(result_set);
            }else{ //if the query throws any type of error
                reject(err);
            }
        });
    });

//render the result of the query into the html page and close the connection
    var obj = promise.then(async function(result_set){ //Runs if the promise was successful
        sumTotal = 0;
        //Log the result set from the database
        connection.end();
        cleanedSet = [];
        result_set.forEach(async totalItem=>{
            console.log(totalItem);
            inCleaned = false;
            countFid = 0;
            currentSeatData = await seatData(totalItem.fid,totalItem.deptTime).then()
            cleanedSet.forEach( cleanedItem=>{
                if(totalItem.fid == cleanedItem.fid && new Date(cleanedItem.deptTime).getTime() === new Date(totalItem.deptTime).getTime()){
                    inCleaned = true;
                    cleanedItem.extras.push(totalItem.optionTitle)
                    cleanedItem.extrasTotal += totalItem.ExtraPrice;
                    sumTotal += totalItem.ExtraPrice;
                }else if(totalItem.fid === cleanedItem.fid && new Date(cleanedItem.deptTime).getTime() !== new Date(totalItem.deptTime).getTime())
                    countFid ++;
            })
            if(!inCleaned){
                console.log('Adding to clean set ', totalItem.fid);
                totalItem.seatData = getFormattedSeatNo(currentSeatData,totalItem.seatSelect)
                totalItem.count = countFid;
                totalItem.noStanding = totalItem.numStanding === 0;
                totalItem.extras = [];
                totalItem.extras.push(totalItem.optionTitle);
                totalItem.extrasTotal = totalItem.ExtraPrice;
                sumTotal += totalItem.ExtraPrice;
                cleanedSet.push(totalItem);
            }
        });


        alias = await aliasTable(cno);
        payment = await paymentData(cno);

        payment.forEach(e=>{
            e.cardNumClean = '**** **** **** ' + e.cardNum.substr(11)
            e.cardExpiry = e.cardEXP.substring(0,1) + "/" + e.cardEXP.substring(2);
        })
        console.log(cleanedSet);
        return {flight: cleanedSet, alias: alias, payment: payment};


        //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


    }).catch(function(err){ //Runs if the promise throws an error
        console.log("THE PROMISE THREW --> " + err);
        connection.end();
    });

    return obj;
}

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

//add any new query functions you make here...
