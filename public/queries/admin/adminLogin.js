var jwt = require('jsonwebtoken');
var adminLogins = require('../tools/adminLogins.json');
var security = require('../tools/security.js');



module.exports = function(parameters){


    username = parameters.username;
    password = parameters.password;
    //Prepare response
    response = {success : false, userFound : false, passMatch : false, token: null};

    //brute force check if data matches hard-coded admin logins
    adminLogins.admin.forEach(loginPair =>{
        if(loginPair.username.toLowerCase() === username.toLowerCase()){
            //For advanced error coding
            response.userFound = true
            if(loginPair.password === password){
                //For advanced error response
                response.passMatch = true;
                //Give the privileges to admin, not as customer
                const payload = {

                    user: false,
                    admin: true
                }
                //Create token w/ super secret code
                var token = jwt.sign(payload, security.adminSecret,{expiresIn: 1440});//24 hrs
                //Respond
                response.token = token;
            }
        }
    });
    //Check if the login was a success
    response.success = response.userFound && response.passMatch

    return response;

}
