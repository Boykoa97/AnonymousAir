var tableLocation = getRoot() + '/queries/tools/tableData.json'
var BreakException = {};
var dbName = 'db_mspouge';

function handleError(data, type, elementId) {
    $.getJSON(tableLocation, function (json) {

        let namingConvention = json.types[type.toLowerCase()];
        let sqlMessage = data.err.sqlMessage.toString();
        let code = data.err.code;
        console.log(data.err.code);
        let errorMessage = 'Error Recieved. Consult logs';
        switch (code) {
            case 'ER_DUP_ENTRY':
                if (sqlMessage.search('PRIMARY')) {
                    dupeField = '';
                    dupeValue = '';
                    namingConvention.primaryKeyAttributes.forEach(e => {
                        dupeField += getFancyName(e.toString(), namingConvention.fieldData) + ", ";
                        console.log(e)
                        console.log(data.inputParameters[e])
                        dupeValue += data.inputParameters[e] + ", "
                    });
                    dupeField = dupeField.substring(0, dupeField.lastIndexOf(','));
                    dupeValue = dupeValue.substring(0, dupeValue.lastIndexOf(','));


                    if (namingConvention.primaryKeyAttributes.length > 1) {
                        dupeField += "combination"
                    }
                } else {
                    try {
                        namingConvention.fieldData.forEach(function (e) {
                            if (sqlMessage.search(e.sqlName) !== -1) {
                                dupeField = e.fancyName;
                                dupeValue = document.getElementById(e.sqlName);
                                throw BreakException;
                            }
                        })
                    }
                    catch (e) {
                        if (e !== BreakException) throw e;
                    }
                }

                errorMessage = 'Error during insertion. Value in field \'' + dupeField + '\' invalid. Duplicate Value = ' + dupeValue;
                break;

            case 'ER_NO_REFERENCED_ROW_2':
            case 'ER_NO_REFRENCED_ROW':

                let attributeNameStart = sqlMessage.indexOf('`',sqlMessage.search("FOREIGN KEY"))+1;
                let attributeNameEnd = sqlMessage.indexOf('`',attributeNameStart + 1);
                let sqlName = sqlMessage.substring(attributeNameStart,attributeNameEnd);
                let tableNameStart = sqlMessage.indexOf('`',sqlMessage.search('REFERENCES'))+1;
                let tableNameEnd = sqlMessage.indexOf('`',tableNameStart+1);
                let tableName = sqlMessage.substring(tableNameStart,tableNameEnd);

                console.log(sqlMessage);
                console.log(sqlName);
                console.log(tableName);
                errorMessage = "Error during insertion. The value in \'" + getFancyName(sqlName,namingConvention.fieldData) + "\' does not exist in the \'" + tableName + "\' data."
                break;
                //TODO: Add handler for ER_BAD_NULL_ERROR
            default:
                errorMessage = 'General error during insertion: ' + data.err.sqlMessage;
                break;
        }

        document.getElementById(elementId).innerHTML = errorMessage;
        document.getElementById(elementId).style.color = 'red';

    })

}

function handleSuccess(data, type, elementId) {
    $.getJSON(tableLocation, function (json) {
        let fieldData = json.types[type.toLowerCase()];
        let primaryKeyNames = '(';

        fieldData.primaryKeyAttributes.forEach(function (pKey) {
            primaryKeyNames += getFancyName(pKey, fieldData.fieldData) + ', ';
        });

        primaryKeyNames = primaryKeyNames.substring(0, primaryKeyNames.lastIndexOf(',')) + ')';

        let primaryKeyValue = '('

        data.primaryKeyValue.forEach(e => {

            primaryKeyValue += e + ", ";

        });

        primaryKeyValue = primaryKeyValue.substring(0, primaryKeyValue.lastIndexOf(',')) + ')';

        document.getElementById(elementId).style.color = 'black'
        document.getElementById(elementId).value = "Successfuly added " + fieldData.displayText + " with " + primaryKeyNames + ": " + primaryKeyValue;
        document.getElementById(elementId).innerHTML = "Successfuly added " + fieldData.displayText + " with " + primaryKeyNames + ": " + primaryKeyValue;

        fieldData.fieldData.forEach(e => {
            document.getElementById(e.sqlName).value = '';
        })

    });

}


function getFancyName(sqlName, nameData) {
    nameData.forEach(function (name) {
        if (sqlName.toString() == name.sqlName)
            returnString = name.fancyName;
    });
    if (typeof returnString == 'undefined') {
        return "ERROR"
    }
    return returnString;
}

function getSQLName(fancyName, nameData) {
    nameData.forEach(function (name) {
        if (fancyName.toString() == name.fancyName)
            returnString = name.sqlName;
    });
    if (typeof returnString == 'undefined') {
        return "ERROR"
    }
    return returnString;
}
