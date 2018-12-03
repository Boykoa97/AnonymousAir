const mysql  = require('mysql');
const host = require('./tools/host.json');


module.exports = function (param,cno) {
    console.log(param)
    var connection = mysql.createConnection(host);
    sql = "Select * FROM Cart WHERE cno = ? Order by oid ASC";

    var promise = new Promise((resolve, reject) => {

        connection.query(mysql.format(sql,[cno]), (err,res)=>{
            if(err == null)
                resolve(res)
            else
                reject(err)
        } )

    })

    return promise.then(res=>{
        connection.end();
        returnValue = true;
        res.forEach(cartValue=>{
            param.forEach(async flight=>{

                if(cartValue.fid == flight.fid && new Date(cartValue.deptTime).getTime() === new Date(flight.deptTime).getTime()) {
                    console.log(cartValue);
                    if (cartValue.oid === 0) {

                       var obj = await addToOnFlight(cartValue.fid, cartValue.deptTime, flight.aliasId, cartValue.seatSelect)
                        returnValue = returnValue && obj;
                    } else {
                        var obj = await addToReservations(cartValue.fid, cartValue.deptTime, flight.aliasId, cartValue.oid)
                        returnValue = returnValue && obj;
                    }

                }

            })
        })
        if(returnValue)
            removeFromCart(cno);

        return returnValue;


    }).catch(err=>{
        console.log(err);
        connection.end();
    });


}

function addToOnFlight(fid,deptTime,aliasId,seatNo){
    var connection = mysql.createConnection(host);
    sql = "INSERT INTO OnFlight VALUES (?,?,?,?)";

    var promise = new Promise((resolve, reject) => {

        connection.query(mysql.format(sql,[fid,deptTime,aliasId,seatNo]), (err,res)=>{
            if(err == null)
                resolve(res)
            else
                reject(err)
        } )

    })

    return promise.then(res=>{
        connection.end();
        return true;




    }).catch(err=>{
        console.log(err);
        connection.end();
        return false;
    });
}

function addToReservations(fid,deptTime,aliasId,oid){
    var connection = mysql.createConnection(host);
    sql = "INSERT INTO Reservations VALUES (?,?,?,?)";

    var promise = new Promise((resolve, reject) => {

        connection.query(mysql.format(sql,[fid,deptTime,aliasId,oid]), (err,res)=>{
            if(err == null)
                resolve(res)
            else
                reject(err)
        } )

    })

    return promise.then(res=>{
        connection.end();

        return true;




    }).catch(err=>{
        console.log(err);
        connection.end();
        return false;
    });
}

function removeFromCart(cno){
    var connection = mysql.createConnection(host);
    sql = "DELETE FROM Cart WHERE cno = ?";

    var promise = new Promise((resolve, reject) => {

        connection.query(mysql.format(sql,[cno]), (err,res)=>{
            if(err == null)
                resolve(res)
            else
                reject(err)
        } )

    })

    return promise.then(res=>{
        connection.end();

        return true;




    }).catch(err=>{
        console.log(err);
        connection.end();
        return false;
    });
}