const mysql = require('mysql');

module.exports = function(param){

    console.log(param)
    var connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge'
    });

    let sql = "SELECT * FROM Flight WHERE fid = ? AND deptTime = ?";


    var promise = new Promise((resolve,reject)=>{


        connection.query(mysql.format(sql,[param.fid, param.deptTime]),(err,res)=>{
            if(err == null)
                resolve(res);
            else
                reject(err);
        })


    })

    var obj =  promise.then(res=>{
        connection.end();
        res = res[0]
        dates = ['deptTime','arrTime','actArrTime','actDeptTime']
        dates.forEach(s=>{
            let paramDate = new Date(res[s])
            let tzOffest = new Date().getTimezoneOffset()*60000
            res[s] = new Date(paramDate - tzOffest).toISOString().replace('T',' ');
            res[s] = res[s].substring(0,res[s].lastIndexOf('.'))
        })
        return res;

    }).catch(err=>{
        console.log(err);
        connection.end()
        return err;
    })

    return obj;




}
