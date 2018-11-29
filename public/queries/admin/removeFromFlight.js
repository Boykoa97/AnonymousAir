var mysql = require('mysql');

module.exports = function(req){
    console.log(req)
    console.log('Request to removeFromFlight Made');
    let connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge'
    })

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