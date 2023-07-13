let canvas = document.getElementById('canvas');
let context = canvas.getContext('2d');
let title = document.getElementById('title');
let lang = document.getElementById('lang');

let spans = [];

let current_text = 'Software Engineer';

function spanify(element){
    let letters = element.innerText;

    element.innerHTML = '';
    spans = [];

    for(let letter of letters){
        let span = document.createElement('span');

        if(letter != ' ') span.classList.add('sspan');

        span.innerText = letter;

        element.appendChild(span);
        spans.push(span);
    }
}

function change(text) {
    current_text = text;
    if(title.innerText == text){
        spanify(title);
    }else{
        title.setAttribute('class', 'fade');
  
        setTimeout(() => {
            title.innerText = text;

            spanify(title);
            
            title.setAttribute('class', 'show');
        }, 1000);
    }
}

function change_software(text) {
    lang.setAttribute('class', 'fade');
  
    setTimeout(() => {
        lang.innerText = text;
            
        lang.setAttribute('class', 'show');
    }, 1000);
}

let langs = [
    'Javascript',
    'C++',
    'Python',
    'C#',
    'Java'
];
let lang_index = 1;

setInterval(() => {
    change_software(langs[lang_index]);
    lang_index++;
    if(lang_index == langs.length) lang_index = 0;
}, 5000);

change('Software Engineer');

function change_div(text1, text) {
    document.getElementById(text1).setAttribute('class', 'appear fade');
  
    setTimeout(() => {
        document.getElementById(text).setAttribute('class', 'appear show');
    }, 1000);
}

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
let width = 700;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

let angle = 0;
let drag = 1500.0;
let lerp_to = Math.PI / 2.0;
let lerp_strength = 0.8;

let left_circle_points = [
    {
        angle: 0,
        title: 'Software Engineer'
    },
    {
        angle: Math.PI,
        title: 'UI/UX Designer'
    }
];

let right_circle_points = [
    {
        angle: Math.PI / 2.0,
        title: 'Surfer'
    },
    {
        angle: Math.PI * 3.0 / 2.0,
        title: 'Game Designer'
    }
];

let input = false;
window.addEventListener('wheel', (event) => {
    angle += event.deltaY / drag;
    if(angle > Math.PI * 2.0) angle -= Math.PI * 2.0;
    if(angle < -Math.PI * 2.0) angle += Math.PI * 2.0;
    input = true;
});

// TODO: mobile touch input

let particles = [];
let lasttime = Date.now();
let time = 0;
let totaltime = 0;

function lerp(x, y, t){
    return (1.0 - t) * x + t * y;
}

function Pixel(x, y, r){
    context.save();

    context.translate(x + canvas.width/2.0, y);
    context.rotate(r*Math.PI/180);

    let alpha = 1.0 - Math.abs(x / 300.0);
    context.fillStyle = 'rgba(31,40,51, ' + alpha + ')';
    context.fillRect(-16, -16, 32, 32);

    context.restore();
}

function Update(){
    context.clearRect(0, 0, canvas.width, canvas.height);
    
    let now = Date.now();
    let dt = (now - lasttime) / 1000.0;
    lasttime = now;
    time += dt;
    totaltime += dt;

    let index = 0;
    for(let span of spans){
        let amt = Math.cos(totaltime*4.0 + index/2.0);

        amt *= 3.0;

        let amt2 = Math.sin(totaltime*4.0 + index*10);

        amt2 /= 2.0;
        
        span.style = 'transform: translate(' + amt2 + 'px, ' + amt + 'px);';

        index++;
    }

    if(!input) angle = lerp(angle, Math.round(angle / lerp_to) * lerp_to, dt * lerp_strength);
    input = false;

    if(time > 0.4){
        time = 0;

        let vx = 0;
        while(Math.abs(vx) < 30) vx = Math.random() * 250 - 125;
        let vy = 0;
        while(Math.abs(vy) < 30) vy = Math.random() * 250 - 125;

        particles.push([(Math.random() < 0.5 ? -1.0 : 1.0) * width/2.0, Math.random() * canvas.height, Math.random() * 360, vx, vy]);
        if(particles.length > 100) particles.splice(0, 1);
    }

    for(let particle of particles){
        particle[0] += particle[3] * dt;
        particle[1] += particle[4] * dt;
        Pixel(particle[0], particle[1], particle[2]);
    }

    // draw circles and points
    context.lineWidth = 4;
    context.strokeStyle = '#1f2833';

    // left circle
    context.beginPath();
    context.arc(canvas.width/2.0 - 675, canvas.height/2.0, 512, -Math.PI/2.0, Math.PI/2.0);
    context.stroke();

    // right circle
    context.beginPath();
    context.arc(canvas.width/2.0 + 675, canvas.height/2.0, 512, Math.PI/2.0, Math.PI*3.0/2.0);
    context.stroke();

    let closest = null;
    let closest_distance = Infinity;

    // left circle points
    context.save();
    context.translate(canvas.width/2.0 - 675, canvas.height/2.0);
    for(let point of left_circle_points){
        let x = Math.cos(point.angle + angle) * 512;
        if(x < 0) continue;
        context.beginPath();
        context.arc(x, Math.sin(point.angle + angle) * 512, 16, 0, Math.PI * 2.0);
        context.stroke();

        let distance = Math.abs(x - 675);
        if(distance < closest_distance){
            closest = point;
            closest_distance = distance;
        }
    }
    context.restore();

    // right circle points
    context.save();
    context.translate(canvas.width/2.0 + 675, canvas.height/2.0);
    for(let point of right_circle_points){
        let x = Math.cos(-(point.angle + angle)) * 512;
        if(x > 0) continue;
        context.beginPath();
        context.arc(x, Math.sin(-(point.angle + angle)) * 512, 16, 0, Math.PI * 2.0);
        context.stroke();

        let distance = Math.abs(x + 675);
        if(distance < closest_distance){
            closest = point;
            closest_distance = distance;
        }
    }
    context.restore();

    if(current_text != closest.title){
        change_div(title.innerText, closest.title);
        change(closest.title);
    }
}

setInterval(Update, 0);