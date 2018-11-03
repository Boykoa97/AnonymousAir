var mysql = require('mysql');

var connection = mysql.createConnection({
  host : 'cosc304.ok.ubc.ca',
  user : 'mspouge',
  password : '13792149',
  database : 'db_mspouge'
});

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }
  console.log('connected as id ' + connection.threadId);
});

//----------------------------DDL and DML--------------------------------------

selectTable()

//-----------------------------------------------------------------------------

//close the connection
connection.end();


//Selects a table from my DB and displays its contents
function selectTable(){
  let sql = 'SELECT * From Airport'
  let query =connection.query(sql,(err,res)=>{
    if(err) throw err;
    console.log(res);
  });
}
