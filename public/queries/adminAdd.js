var json = require('./tools/tableData.json');

module.exports = function(parameter){

    var returnObj = null;

    try{
        returnObj = json.types[parameter.type.toLowerCase()]
    }catch(err) {
        console.err(err);
    }
    return {nameConvention: returnObj.fieldData, displayText: returnObj.displayText, type: parameter.type};
}