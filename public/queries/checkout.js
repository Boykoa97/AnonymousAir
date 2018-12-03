var mysql = require("mysql");
var host = require('./tools/host.json');
//this is just for one query on the page, more can be added
function contact_query1(cno){

  //connect to database
  var connection = mysql.createConnection(host);

//write an sql statement for querying the database

//~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
let sql = 'SELECT numStanding,Flight.*,Cart.*, Extra.optionTitle, Extra.price as ExtraPrice From Cart natural join Flight natural join Airplane natural join AirplaneModel, Extra Where Extra.oid = Cart.oid AND cno="'+cno+'"';
//~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//Create a promise so we can close the connection synchronously
var promise = new Promise(function(resolve,reject){

  //send the sql query to the database
  connection.query(sql,(err,result_set)=>{
      if(err == null){ //if the query is successful
        resolve(result_set);
      }else{ //if the query throws any type of error
        reject(err);
      }
  });
});

//render the result of the query into the html page and close the connection
var obj = promise.then(function(result_set){ //Runs if the promise was successful
    sumTotal = 0;
  //Log the result set from the database
  console.log(result_set);
  connection.end();
  cleanedSet = [];
    result_set.forEach(totalItem=>{
        inCleaned = false;

        cleanedSet.forEach(cleanedItem=>{
            if(totalItem.fid === cleanedItem.fid && new Date(cleanedItem.deptTime).getTime() === new Date(totalItem.deptTime).getTime()){
                inCleaned = true;
                cleanedItem.extras.push(totalItem.optionTitle)
                cleanedItem.extrasTotal += totalItem.ExtraPrice;
                sumTotal += totalItem.ExtraPrice;
            }
        })
        if(!inCleaned){
            totalItem.noStanding = totalItem.numStanding === 0;
            totalItem.extras = [];
            totalItem.extras.push(totalItem.optionTitle);
            totalItem.extrasTotal = totalItem.ExtraPrice;
            sumTotal += totalItem.ExtraPrice;
            cleanedSet.push(totalItem);
        }
    });



  //return the variables you want to see on the HTML page

  //~~~~~~~~~~~~~~~~~~~~~~~~EDIT~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
  //can add data manipulation here (i.e. for-loops, calculations,
  // or anything you need to format after obtaining the data from the db)

  return {title:'Checkout', response: cleanedSet, extraTotal: sumTotal};


  //~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~


}).catch(function(err){ //Runs if the promise throws an error
  console.log("THE PROMISE THREW --> " + err);
  connection.end();
});

return obj;
}

//add any new query functions you make here...
module.exports.checkout = contact_query1;
