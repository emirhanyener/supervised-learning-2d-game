var canvas = document.getElementById("canvas");
canvas.setAttribute('width', window.innerWidth * 0.8);
canvas.setAttribute('height', window.innerHeight * 0.8);

var ctx = canvas.getContext("2d");
var info = document.getElementById("info-text");

class Position {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

let is_end = false;

let secure_position = new Position(100, 100);
let score = 0;
let generation = 100;
setInterval(update, 10);

let networks = [];
for(let i = 0; i < generation; i++){
	networks.push(new Network());
}

let characters = [];
for(let i = 0; i < generation; i++){
	characters.push(new Character(400, 300));
}

let right = false;
let left = false;
let up = false;
let down = false;

start();
alive = generation;
function start(){
	for(let i = 0; i < generation; i++){
		networks[i].add_layer([4, 6, 2]);
	}
}

const time_delay = 500;
let saved_time = (new Date()).getTime();

function update(){
	const d = new Date();
	if(d.getTime() - saved_time > time_delay){
		update_secure();
		saved_time = d.getTime();
	}

	if(alive == 0){
		reset_all();
		return;
	}

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, window.innerWidth * 0.8, window.innerHeight * 0.8);
	ctx.fillStyle = "#009900";
	ctx.fillRect(secure_position.x, secure_position.y, 200, 200);
	
	for(let i = 0; i < generation; i++){
		if(characters[i].is_alive){
			networks[i].calculate([((characters[i].position_x) / (window.innerWidth * 0.8)), ((secure_position.x + 100) / (window.innerWidth * 0.8)), ((characters[i].position_y) / (window.innerHeight * 0.8)), ((secure_position.y + 100) / (window.innerHeight * 0.8))]);
			characters[i].velocity_x = networks[i].layers[networks[i].layers.length - 1].neurons[0].value;
			characters[i].velocity_y = networks[i].layers[networks[i].layers.length - 1].neurons[1].value;
			characters[i].calculate();

			ctx.fillStyle = "#990000";
			ctx.fillRect(characters[i].position_x, characters[i].position_y, 25, 25);
		}
	}

	score++;
	document.getElementById("score-text").innerHTML = "score = " + score;
	document.getElementById("info-text").innerHTML = "alive = " + alive;
}

function reset_all(){
	update_secure();
	saved_time = (new Date()).getTime();
	score = 0;
	alive = generation;
	
	for(let i = 0; i < generation; i++){
		networks[i].next();
		characters[i].position_x = 500;
		characters[i].position_y = 250;
		characters[i].is_alive = true;
	}
}

function update_secure(){
	for(let i = 0; i < generation; i++){
		if(Math.abs(secure_position.x + 100 - characters[i].position_x) > 100 || Math.abs(secure_position.y + 100 - characters[i].position_y) > 100){
			if(characters[i].is_alive){
				characters[i].is_alive = false;
				alive--;
			}
		}
	}

	secure_position.x = Math.round(Math.random() * window.innerWidth * 0.8);
	secure_position.y = Math.round(Math.random() * window.innerHeight * 0.8);
	if(secure_position.x > window.innerWidth * 0.8 - 200)
		secure_position.x -= 200;
	if(secure_position.y > window.innerHeight * 0.8 - 200)
		secure_position.y -= 200;
}