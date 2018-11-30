function removeFromFlight(aliasId, fid, deptTime) {
    console.log(fid, deptTime)
    buttonId = '#rem' + aliasId;
    rowId = '#row' + aliasId;
    $(buttonId).value = "Working...";

    $.post(

        '/admin/queries/removeFromFlight',
        {aliasId: aliasId, fid: fid, deptTime: deptTime},
        res => {
            if (res.success) {
                $(rowId).fadeOut();
                setTimeout(function(){
                    $('#manifestModal').modal({show: false});
                    displayFlightManifest(fid, deptTime)
                },500)

            } else {
                $(buttonId).innerText = "Failed"
                $(buttonId).color = "red"
            }
        }
    )
}

function changeSeat(aliasId,fid,deptTime,finalSeat) {


}

function displayFlightManifest(flightId, departureInfo) {
    console.log(flightId, departureInfo)
    $("#manifestContent").innerText = "Loading..."
    $("#manifestContent").load(
        '/admin/manifestTable',
        {fid: flightId, deptTime: departureInfo},
        function () {
            $('#manifestModal').modal()
        }
    )
}
