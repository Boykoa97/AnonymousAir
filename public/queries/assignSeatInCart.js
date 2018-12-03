const mysql = require('mysql')
const host = require('./tools/host.json');
const planeData = require('./admin/planeData.js');

module.exports = async function(param, cno){
    console.log(param)
    var connection = mysql.createConnection(host);

    date = new Date(param.deptTime);
    tzOffest = new Date().getTimezoneOffset() * 60000;
    param.deptTime =new Date(date - tzOffest).toISOString().replace('T', ' ').replace('Z', '')

    seatNo = await getFirstSeat(param.type,param.fid,param.deptTime);

    let sql = "UPDATE Cart SET seatSelect = ? WHERE cno = ? AND fid = ? AND deptTime = ?"

    var promise = new Promise((resolve, reject) => {

        connection.query(mysql.format(sql,[seatNo,cno,param.fid,param.deptTime]),(err,result)=>{
            if(err == null)
                resolve(result)
            else
                reject(err);
        })
    })

    return promise.then(res=>{
        connection.end();
        console.log(res)
        return true;
    }).catch(err=>{
        connection.end(
        )
        console.log(err);
        return false;
    })




};



function getFirstSeat(type, fid,deptTime){

    var connection = mysql.createConnection(host);
    sql = "SELECT seatNo FROM OnFlight WHERE fid = ? AND deptTime = ?"


    var promise = new Promise((resolve, reject) => {

        connection.query(mysql.format(sql,[fid,deptTime]),(err,result)=>{
            if(err == null)
                resolve(result)
            else
                reject(err);
        })
    })

    return promise.then(result=>{
        connection.end();
        return (planeData(fid,deptTime).then(seatingData=>{

            if(type == "firstClass")
                startGuess = 0;
            else if(type =="econ")
                startGuess = seatingData.numFirstClass;
            else
                startGuess = seatingData.numSeats;

            invalid = true;
            while(invalid){
                startGuess++;
                result.forEach(e=>{
                    passed = true
                    if(e.seatNo === startGuess){
                        passed = false;
                    }
                })

                invalid = !passed;
            }

            return startGuess;

        }))
    }).catch(err=>{
        connection.end()
        console.log(err);
    })


}