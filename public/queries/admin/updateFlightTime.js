const mysql = require('mysql');

module.exports = function(param){

    console.log(param)
    var connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge'
    });

    let sql = "UPDATE Flight SET actArrTime = ?, actDeptTime =? WHERE fid = ? AND deptTime = ?";
    if(param.actArrTime == '')
        param.actArrTime = null;
    if(param.actDeptTime == '')
        param.actDeptTime = null;

    var promise = new Promise((resolve,reject)=>{


        connection.query(mysql.format(sql,[param.actArrTime,param.actDeptTime,param.fid,param.deptTime]),(err,res)=>{
            if(err == null)
                resolve(res);
            else
                reject(err);
        })


    })

    var obj =  promise.then(res=>{
        connection.end();

        return {success:true};

    }).catch(err=>{
        console.log(err);
        connection.end()
        return {success: false};
    })

    return obj;




}
