const mysql = require('mysql');
const planeData = require('./planeData.js');
const host = require('../tools/host.json');

module.exports = async function(param){

    console.log(param)
    var connection = mysql.createConnection(host);

    let sql = "UPDATE OnFlight SET seatNo = ? WHERE fid = ? AND deptTime = ? AND aliasId = ?"

    var seatNo = await getNumericSeatNumber(param.seat,param.fid,param.deptTime)

    var promise = new Promise((resolve,reject)=>{
        console.log('Seat Number: ',seatNo);
        if(seatNo === -1)
            reject("Seat Number Bad");

        connection.query(mysql.format(sql,[seatNo,param.fid,param.deptTime,param.aliasId]),(err,res)=>{
            if(err == null)
                resolve(res);
            else
                reject(err);
        })


    })

    var obj =  await promise.then(res=>{
        connection.end();

        return {success: true}

    }).catch(err=>{
        console.log(err);
        connection.end()
        return {success: false, text: 'The seat is not valid!'}
    })

    return obj;




}


async function getNumericSeatNumber(seatNoString,fid,deptTime){

    seatData =  await planeData(fid,deptTime);
    let seatNo = 0;

    row = parseInt(seatNoString);

    console.log(row);
    if(isNaN(row)){
        if(seatNoString.toString().startsWith('S')){
            let num = parseInt(seatNoString.substring(1));
            if(!isNaN(num))
                seatNo = seatData.numSeats + num;
            else
                 return -1
        }else{
            return -1
        }
    }
    seat = seatNoString.substring(row.toString().length);
    if(seat == '')
        seatNo = -1;
    console.log('Seat: ',seat)
    let rowF = Math.ceil(seatData.numFirstClass/seatData.colFirstClass);
    console.log('rowF',rowF)
    let rowE = Math.ceil((seatData.numSeats-seatData.numFirstClass)/seatData.colEcon);
    console.log('rowE: ',rowE)
    if(row > rowF) {
        seatNo += seatData.numFirstClass;
        seatNo += (row-1-rowF)*seatData.colEcon;
        seatNo += seat.charCodeAt(0) - 64;

    }else{

        seatNo += seatData.colFirstClass*(row-1);
        seatNo += seat.charCodeAt(0)-64;

        if(seatNo > seatData.numFirstClass)
            return -1;
    }

    return seatNo;
}