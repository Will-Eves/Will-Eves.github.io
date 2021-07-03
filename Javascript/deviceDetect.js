let deviceType;

function check(){
    if(window.innerWidth > window.innerHeight){
        //PC Device
        document.getElementById("style").href = "CSS/style.css";
        deviceType = "pc";
    }else{
        //Mobile Device
        document.getElementById("style").href = "CSS/style_mobile.css";
        deviceType = "mobile";
    }
}

window.onload = check();