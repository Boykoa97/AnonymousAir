function addComplete(ids){

    let data =[];

    ids.forEach(id =>{
        let div = $("body").find('#'+id);
        let obj = {};
        console.log(div.prop('fid'))
        obj.fid = div.data('fid')
        obj.deptTime = div.data('depttime')
        obj.aliasId = div.find("#alias").val()
        obj.paymentCC = div.find("#payment").val()
        data.push(obj)
    })
    console.log(data);
    $.post(
        '/checkout/checkout/complete',
        {flights:data},
        res=>{
            if(res.success)
                window.location.href='/main';
            else
                alert("Unable to complete transaction")
        }
    )


}