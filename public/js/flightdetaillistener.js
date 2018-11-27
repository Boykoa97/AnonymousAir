
//client side script for button database query
var classname = document.getElementsByClassName("purchase");

var addtocart = function(){
    var attribute = this.getAttribute("data-myattribute");
    let url = "/queries/addtocart";
    $.get(url);
};

for (var i = 0; i < classname.length; i++) {
  classname[i].addEventListener('click', addtocart, false);
}
