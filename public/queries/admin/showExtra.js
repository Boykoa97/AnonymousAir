const mysql = require('mysql');
const host = require('../tools/host.json');

module.exports = function(param){


    var connection = mysql.createConnection(host);

    param.extras.forEach((extra,i)=>{
        param.extras[i].oid = parseInt(extra.oid)
    })
    console.log(param)

    let sql = "SELECT * FROM Extra";

    var promise = new Promise(((resolve, reject) => {
        connection.query(sql,(err,results)=>{
            if(err == null)
                resolve(results);
            else
                reject(err);
        });
    }));

    return promise.then(res=> {

        connection.end();
        returnedData =[];
        res.forEach(e=>{
            if(param.extras.includes(e.oid.toString())) {
                e.price = e.price.toFixed(2).toString()
                returnedData.push(e);
            }
        })
        console.log(returnedData)
        return returnedData;

    }).catch(err=>{
        connection.end();
        console.log(err);
    })


}