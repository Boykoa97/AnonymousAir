const mysql = require('mysql');

module.exports = function(param){

    console.log(param)
    var connection = mysql.createConnection({
        host : 'cosc304.ok.ubc.ca',
        user : 'mspouge',
        password : '13792149',
        database : 'db_mspouge'
    });

    let sql = "UPDATE Customer SET username = ?, password =?, email = ? WHERE cno =?";


    var promise = new Promise((resolve,reject)=>{


        connection.query(mysql.format(sql,[param.username,param.password,param.email,param.cno]),(err,res)=>{
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
