
//client side script for button database query
var classname = document.getElementsByClassName("purchase");

var addtocart = function(){

    //var attribute = this.getAttribute("data-myattribute");
    let url = "/queries/addtocart";
    console.log(url+"?fid="+this.fid+"&deptTime="+this.deptTime);
    $.get(url+"?fid="+this.fid+"&deptTime="+this.deptTime);
};

for (var i = 0; i < classname.length; i++) {

  var module = {
    fid: classname[i].attributes.fid.value,
    deptTime: classname[i].attributes.deptTime.value
  }
  classname[i].addEventListener('click', addtocart.bind(module), false);
}
