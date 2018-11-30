function loadAliasData(customerNumber){
    $("#aliasContent").load(
        '/admin/aliasTable',
        {cno: customerNumber},
        function () {
            $('#aliasModal').modal()
        }
    )
    $('#aliasModal').modal()
}

function showUpdateCustomerInfo(customerNumber){
    $("#aliasContent").load(
        '/admin/updateCustomer',
        {cno:customerNumber},
        function(){
            $('#aliasModal').modal()
        }
    )


}

function updateCustomerInfo(customerNumber){

    let username = $('#aliasContent #changeUser-Username').val();
    let password = $('#aliasContent #changeUser-Password').val();
    let email =    $('#aliasContent #changeUser-Email').val();

    console.log(username,password,email,customerNumber)

    $.post(
        '/admin/queries/updateCustomer',
        {cno: customerNumber, username: username, password: password, email: email},
        res=>{
            if(res.success){
                location.reload();
            }else{
                $('#aliasContent #changeUserErr').text('Failed to update data!');
            }
        }
    )



}