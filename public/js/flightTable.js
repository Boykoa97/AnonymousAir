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

function changeSeatModal(aliasId, fid, deptTime, aliasFirst, aliasMid, aliasLast, seatNo) {
    $("#manifestModal").modal('toggle');
    $("#manifestContent").load(
        '/admin/changeSeatModal',
        {fid: fid, deptTime: deptTime, aliasId: aliasId,
            aliasName: aliasLast +', ' + aliasFirst +' ' + aliasMid.substring(0,1) +'.',
            seatNo: seatNo
        },
        function () {
            $('#manifestModal').modal()
        }
    )
}

function displayFlightManifest(flightId, departureInfo) {
    console.log(flightId, departureInfo)
    $("#manifestContent").text("Loading...")
    $("#manifestContent").load(
        '/admin/manifestTable',
        {fid: flightId, deptTime: departureInfo},
        function () {
            $('#manifestModal').modal()
        }
    )
}

function confirmSeatChange(fid,deptTime,aliasId){
    desiredSeat = $('#manifestContent #changedSeatNo').val();
    console.log("desired seat: ",desiredSeat);
    $.post(
        '/admin/queries/changeSeat',
        {fid: fid, deptTime: deptTime, aliasId: aliasId, seat: desiredSeat},
        res=>{
            if(res.success){
                displayFlightManifest(fid,deptTime);
            }else{
                $('#changeSeatResult').text(res.text);
            }
        }
    )
}

function displayUpdateFlightPage(fid,deptTime){
    $("#manifestContent").load(
        '/admin/updateFlight',
        {fid: fid, deptTime: deptTime},
        function () {
            $('#manifestModal').modal()
        }
    )
}

function updateFlightTime(fid,deptTime){
    actArrTime = $('#manifestContent #changeFlight-Arr').val();
    actDeptTime = $('#manifestContent #changeFlight-Dept').val();
    $.post(
        '/admin/queries/updateFlightTime',
        {fid: fid, deptTime: deptTime, actArrTime: actArrTime, actDeptTime: actDeptTime},
        res =>{
          if(res.success){
              window.location.reload();
          }else{
              $('#updateFlightTimeErr').text('Error!')
          }
        })
}

function cancelFlight(fid,deptTime){
    actArrTime = null;
    actDeptTime = null;
    $.post(
        '/admin/queries/updateFlightTime',
        {fid: fid, deptTime: deptTime, actArrTime: actArrTime, actDeptTime: actDeptTime},
        res =>{
            if(res.success){
                window.location.reload();
            }else{
                $('#updateFlightTimeErr').text('Error!')
            }
        });
}
