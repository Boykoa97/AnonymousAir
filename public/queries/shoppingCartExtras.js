const mysql = require('mysql');
const host = require('./tools/host.json');

module.exports = function(param){


    var connection = mysql.createConnection(host);
    date = new Date(param.deptTime);
    tzOffest = new Date().getTimezoneOffset() * 60000;
    param.deptTime =new Date(date - tzOffest).toISOString().replace('T', ' ').replace('Z', '');
    console.log(param)

    let sql = "SELECT * FROM OnFlightExtra natural join Extra WHERE fid = ? AND deptTime = ?";

    var promise = new Promise(((resolve, reject) => {
        connection.query(mysql.format(sql,[param.fid,param.deptTime]),(err,results)=>{
            if(err == null)
                resolve(results);
            else
                reject(err);
        });
    }));

    return promise.then(res=> {

        connection.end();
        res.forEach((e,i)=>{
            if(e.oid === 0) {
                e.isDefault = true;
            }
        })

        console.log(res);
        return res;

    }).catch(err=>{
        connection.end();
        console.log(err);
    })


}