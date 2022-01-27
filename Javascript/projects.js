var image = document.getElementById("image");
var link = document.getElementById("link");

var index = 0;

var elements = [];
var links = [];
var length;

function moveLeft(){
    index--;
    if(index < 0){
        index = length - 1;
    }
    image.src = elements[index].src;
    link.href = links[index].href;
}

function moveRight(){
    index++;
    if(index >= length){
        index = 0;
    }
    image.src = elements[index].src;
    link.href = links[index].href;
}

function onload(){
    elements = document.getElementsByName("image");
    links = document.getElementsByName("link");
    length = elements.length;
    
    image.src = elements[0].src;
    link.href = links[0].href;
    console.log(link.href);
}