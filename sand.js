var Input = {
    x : 0,
    y : 0,
    mousePos : {x : 0, y : 0},
    keys : [],
    mouseDown : false,
    setup : function(c){
        for(i = 0; i < 500; i++){
            this.keys[i] = false;   
        }
        document.addEventListener("mousemove", function(event){
            var rect = c.getBoundingClientRect();
            Input.mousePos.x = event.clientX - rect.left;
            Input.mousePos.y = event.clientY - rect.top;
        });
        document.addEventListener("mousedown", function(event){
            this.mouseDown = true;
        });
        document.addEventListener("mouseup", function(event){
            this.mouseDown = false;
        });
        document.addEventListener("keydown", event => {
            var key = event.key;
            this.keys[event.keyCode] = true;
        });
        document.addEventListener("keyup", event => {
            var key = event.key;
            this.keys[event.keyCode] = false;
        });
    },
    update : function(){
        this.x = 0;
        this.y = 0;
        if((this.keys[87] || this.keys[38]) && !(this.keys[83] || this.keys[40])){
            this.y = 1;   
        }
        if((this.keys[83] || this.keys[40]) && !(this.keys[87] || this.keys[38])){
            this.y = -1;   
        }
        if((this.keys[68] || this.keys[39]) && !(this.keys[65] || this.keys[37])){
            this.x = 1;
        }
        if((this.keys[65] || this.keys[37]) && !(this.keys[68] || this.keys[39])){
            this.x = -1;
        }
    },
    isKeyPressed : function(k){
        return this.keys[k];
    },
    isButtonPressed : function(b){
        //do something  
    },
    toKey : function(n){
        return String.fromCharCode(n).toLowerCase();   
    },
    toCode : function(c){
        return c.charCodeAt(0); 
    }
};

var Render = {
    createWindow() {
        this.canvas = document.getElementById("sandcanvas");
        this.canvas.width = window.innerWidth / 100 * 32;
        this.canvas.height = window.innerWidth / 100 * 32;
        this.ctx = this.canvas.getContext('2d');
        this.res = 0;
        this.setRes(64);
    },
    setRes(r) {
        this.res = window.innerWidth / 100 * 32;
        this.res /= r;
    },
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
    renderParticle(particle){
        let r = particle.color.r;
        let g = particle.color.g;
        let b = particle.color.b;
        this.ctx.fillStyle = "rgb(" + r + "," + g + "," + b + ")";
        this.ctx.fillRect(particle.pos.x * this.res, particle.pos.y * this.res, this.res, this.res);
    }
}

var particles = [];

var World = {
    start() {
        Render.createWindow();
        particles = [];
        this.res = 64;
        Render.setRes(this.res);
    },
    update() {
        Input.update();

        if(Math.random() > 0.5){
            World.add(new Sand(Math.round(Math.random() * 10 - 5 + 10), 0));
        }else{
            World.add(new Water(Math.round(Math.random() * 10 - 5 + 30), 0));
        }

        Render.clear();
        for(let p of particles){
            p.draw();
            p.update();
        }
    },
    add(p) {
        particles.push(p);
    },
    get(x, y, exclude=null){
        if(x < 0 || x > this.res - 1 || y < 0 || y > this.res - 1){
            return -1;
        }
        for(let p of particles){
            if(p.pos.x == x && p.pos.y == y && p != exclude){
                return p.type;
            }
        }
        return 0;
    },
    getParticle(x, y, exclude=null){
        for(let p of particles){
            if(p.pos.x == x && p.pos.y == y && p != exclude){
                return p;
            }
        }
    },
};

class Particle{
    constructor(x, y, r=255, g=255, b=255){
        this.pos = {
            x : x,
            y : y
        };
        this.color = {
            r : r,
            g : g,
            b : b
        }
        this.type = 0;
        this.update = function(){};
    }

    draw() {
        Render.renderParticle(this);
    }
}

class Sand extends Particle{
    constructor(x, y){
        super(x, y, 250, 219, 175);
        this.type = 1;
        this.update = function(){
            let x = this.pos.x;
            let y = this.pos.y;

            if(World.get(x, y, this) == 1){
                this.pos.y -= 1;
            }

            if(World.get(x, y + 1) == 0){
                this.pos.y += 1;
            }else if(World.get(x - 1, y + 1) == 0){
                this.pos.x -= 1;
                this.pos.y += 1;
            }else if(World.get(x + 1, y + 1) == 0){
                this.pos.x += 1;
                this.pos.y += 1;
            }else if(World.get(x, y + 1) == 2){
                this.pos.y += 1;
                let p = World.getParticle(x, y + 1);
                p.pos.y -= 1;
            }else if(World.get(x - 1, y + 1) == 2){
                this.pos.x -= 1;
                this.pos.y += 1;
                let p = World.getParticle(x - 1, y + 1);
                p.pos.y -= 1;
            }else if(World.get(x + 1, y + 1) == 2){
                this.pos.x += 1;
                this.pos.y += 1;
                let p = World.getParticle(x + 1, y + 1);
                p.pos.y -= 1;
            }
        }
    }
}

class Water extends Particle{
    constructor(x, y){
        super(x, y, 10, 50, 255);
        this.type = 2;
        this.update = function(){
            let x = this.pos.x;
            let y = this.pos.y;

            if(World.get(x, y, this) == 2){
                this.pos.y -= 1;
            }

            if(World.get(x, y - 1, this) == 1){
                this.pos.y -= 1;
                let p = World.getParticle(x, y - 1);
                p.pos.y += 1;
            }

            if(World.get(x, y + 1) == 0){
                this.pos.y += 1;
            }else if(World.get(x - 1, y + 1) == 0){
                this.pos.x -= 1;
                this.pos.y += 1;
            }else if(World.get(x + 1, y + 1) == 0){
                this.pos.x += 1;
                this.pos.y += 1;
            }else if(World.get(x - 1, y) == 0){
                this.pos.x -= 1;
            }else if(World.get(x + 1, y) == 0){
                this.pos.x += 1;
            }
        }
    }
}

class Wood extends Particle{
    constructor(x, y){
        super(x, y, 133, 94, 66);
        this.type = 3;
    }
}

window.onload = function(){
    World.start();
    Input.setup(Render.canvas);

    for(let x = 24; x < 36; x++){
        for(let y = 13; y < 17; y++){
            if(x == 26 || x == 30){
                break
            }
            World.add(new Wood(x, y));
        }
    }

    setInterval(World.update, 100);
};