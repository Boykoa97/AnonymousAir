var mysql = require('mysql');
const host = require('../tools/host.json');

module.exports = function(req){
    console.log(req)
    console.log('Request to removeFromFlight Made');
    let connection = mysql.createConnection(host)

    let sql = "DELETE FROM OnFlight WHERE aliasId = ? AND fid = ? AND deptTime = ?"

    var promise = new Promise(((resolve, reject) => {

        connection.query(mysql.format(sql,[req.aliasId,req.fid,req.deptTime]),(err,res)=>{
            console.log("Queried the data")
            if(err == null){
                console.log("Success")
                resolve(res);
            }else{
                console.log("Error")
                reject(err);
            }
        })

    }))

    return promise.then(res=> {
        connection.end()
        return {success: true}
    }).catch(err=>{
        console.log(err);
        connection.end();
        return {success: false}
    });

}