const mysql = require('mysql');
const host = require('./tools/host.json');

module.exports = function(param){
    console.log(param)
    return insertToTable(0,param.checked,param.cno,param.fid,param.deptTime)




}

function insertToTable(index, oids, cno,fid,deptTime){

    connection = mysql.createConnection(host);
    if(index == oids.length)
        return true;
    sqlString = 'INSERT INTO Cart VALUES (?,?,?,?,?)';

    let promise = new Promise(((resolve, reject) => {

        connection.query(mysql.format(sqlString,[cno,fid,deptTime,oids[index],null]),(err,res)=>{
            if(err == null)
                resolve(res);
            else
                reject(err);
            }
        )

    }))

    return promise.then(res=>{
        connection.end()
        return insertToTable(index + 1,oids,cno,fid,deptTime)
    }).catch(err=>{
        connection.end()
        console.log(err);
        return false;
    })


}