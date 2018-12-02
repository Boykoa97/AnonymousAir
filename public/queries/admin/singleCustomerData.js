const mysql = require('mysql');
const host = require('../tools/host.json');

module.exports = function(param){

    console.log(param)
    var connection = mysql.createConnection(host);

    let sql = "SELECT * FROM Customer WHERE cno = ?";


    var promise = new Promise((resolve,reject)=>{


        connection.query(mysql.format(sql,[param.cno]),(err,res)=>{
            if(err == null)
                resolve(res);
            else
                reject(err);
        })


    })

    var obj =  promise.then(res=>{
        connection.end();

        return res[0];

    }).catch(err=>{
        console.log(err);
        connection.end()
        return err;
    })

    return obj;




}
