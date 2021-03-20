var score = document.getElementById("score");
var highscore = document.getElementById("highscore");

var ctx = document.getElementById("canvas").getContext("2d");
var objects = [];
var length = 1;

var usingAI = false;

var snakehead = {
  start : function(){
    this.pos = [0, 0];
    this.direction = 2;
  },
  draw : function(){
    ctx.fillStyle = "red";
    ctx.fillRect(this.pos[0] * 30, this.pos[1] * 30, 30, 30);
    if(inputs.length >= 1){
      this.direction = inputs[0];
      if(usingAI == true){
        inputs[inputs.length] = inputs[0];
        inputs.splice(0, 1);
      }else{
        inputs.splice(0, 1);
      }
    }
    if(this.direction == 1){
      this.pos[1] -= 1;
    }else if(this.direction == 2){
      this.pos[0] += 1;
    }else if(this.direction == 3){
      this.pos[1] += 1;
    }else if(this.direction == 4){
      this.pos[0] -= 1;
    }
    if(this.pos[0] < 0){
      this.pos[0] = 21;
    }else if(this.pos[0] > 21){
      this.pos[0] = 0;
    }
    if(this.pos[1] < 0){
      this.pos[1] = 15;
    }else if(this.pos[1] > 15){
      this.pos[1] = 0;
    }
  }
}

let key;
let inputs = [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 3];

document.addEventListener("keydown", function(event){
  key = event.key;
  if(usingAI == false){
    if(key == "w" || key == "ArrowUp"){
      inputs[inputs.length] = 1;
    }
    if(key == "s" || key == "ArrowDown"){
      inputs[inputs.length] = 3;
    }
    if(key == "a" || key == "ArrowLeft"){
      inputs[inputs.length] = 4;
    }
    if(key == "d" || key == "ArrowRight"){
      inputs[inputs.length] = 2;
    }
  }
  if(key == "r"){
    start();
  }
});

var apple = {
  start : function(){
    this.pos = [Math.round(Math.random() * 18) + 1, Math.round(Math.random() * 13) + 1];
  },
  draw : function(){
    ctx.fillStyle = "green";
    ctx.fillRect(this.pos[0] * 30, this.pos[1] * 30, 30, 30);
    if(this.pos[0] == snakehead.pos[0] && this.pos[1] == snakehead.pos[1]){
      length += 1;
      if(length > localStorage.getItem("h")){
        localStorage.setItem("h", length);
      }
      this.pos = [Math.round(Math.random() * 21), Math.round(Math.random() * 15)];
      let j = 0;
      while(j < objects.length){
        if((this.pos[0] == objects[j].pos[0] && this.pos[1] == objects[j].pos[1])){
          this.pos = [Math.round(Math.random() * 21), Math.round(Math.random() * 15)];
          j = 0;
        }
        j++;
      }
    }
  }
}

window.onload = function(){
  snakehead.start();
  apple.start();
  if(usingAI == false){
    inputs = [];
  }
  if(localStorage.getItem("t") != 1){
    localStorage.setItem("t", 1);
    localStorage.setItem("h", 0);
  }
  if(usingAI == true){
    setInterval(update, 1);
  }else{
    setInterval(update, 100);
  }
}

function start(){
  snakehead.start();
  if(usingAI == false){
    inputs = [];
  }
  objects = [];
  apple.start();
  dead = false;
  length = 1;
}

function update(){
  ctx.clearRect(0, 0, 660, 480);
  if(dead == false){
  new tail();
    snakehead.draw();
    apple.draw();
    for(i = 0; i < objects.length; i++){
      objects[i].draw();
    }
    if(objects.length >= length){
      objects.splice(0, 1);
    }
    ctx.fillStyle = "black"
  }else{
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 660, 480);
    ctx.fillStyle = "white";
    ctx.fillText("You Died! Press r to restart" ,250 ,225);
  }
  score.innerHTML = "Score : " + length;
  highscore.innerHTML = "Highscore : " + localStorage.getItem("h");
}

var dead = false;

function die(){
  dead = true;
}

class tail{
  constructor(){
    this.pos = [snakehead.pos[0], snakehead.pos[1]];
    this.draw = function(){
      ctx.fillStyle = "red";
      ctx.fillRect(this.pos[0] * 30, this.pos[1] * 30, 30, 30);
      if(this.pos[0] == snakehead.pos[0] && this.pos[1] == snakehead.pos[1] && length < 300){
        die();
      }
    }
    objects[objects.length] = this;
  }
}

function resetHighscore(){
  localStorage.setItem("h", 0);
}