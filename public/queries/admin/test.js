seatData = {
    numFirstClass: 30,
    colFirstClass: 4,
    numSeats: 300,
    colEcon: 6
}

/*
seatNo ='31'

response = {seatNo: "N/A", type: "N/A", price: 0}
seatNo = parseInt(seatNo);




if(seatNo <= seatData.numFirstClass){

    row = Math.ceil(seatNo/seatData.colFirstClass)
    letter = String.fromCharCode((seatNo - (row-1)*seatData.colFirstClass)+64);

    response.seatNo = row+letter;
    response.type = "FCLASS";
    response.price = seatData.priceFirstClass

}else if (seatNo <= seatData.numSeats){
    rowF = Math.ceil(seatData.numFirstClass/seatData.colFirstClass);
    row = Math.ceil((seatNo-seatData.numFirstClass)/seatData.colEcon);
    letter = String.fromCharCode((seatNo - (row-1)*seatData.colEcon -seatData.numFirstClass)+64);

    response.seatNo = (rowF+row)+letter;
    response.type = "ECON";
    response.price = seatData.price
}else{
    response.seatNo = "S"+(seatNo-seatData.numSeats);
    response.type = "STDNG";
    response.price = seatData.priceStanding
}
console.log(response)
*/

seatNoString='9A';

let seatNo = 0;

row = parseInt(seatNoString);

console.log(row);
if(isNaN(row)){
    if(seatNoString.toString().startsWith('S')){
        let num = parseInt(seatNoString.substring(1));
        if(!isNaN(num))
            seatNo = seatData.numSeats + num;
        else
            seatNo = -1
    }else{
        seatNo = -1
    }
}
seat = seatNoString.substring(row.toString().length);
if(seat == '')
    seatNo = -1;
console.log('Seat: ',seat)
let rowF = Math.ceil(seatData.numFirstClass/seatData.colFirstClass);
console.log('rowF',rowF)
let rowE = Math.ceil((seatData.numSeats-seatData.numFirstClass)/seatData.colEcon);
console.log('rowE: ',rowE)
if(row > rowF) {
    seatNo += seatData.numFirstClass;
    seatNo += (row-1-rowF)*seatData.colEcon;
    seatNo += seat.charCodeAt(0) - 64;

}else{

    seatNo += seatData.colFirstClass*(row-1);
    seatNo += seat.charCodeAt(0)-64;

    if(seatNo > seatData.numFirstClass)
        seatNo = -1;
}


console.log(seatNo);

