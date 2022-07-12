class Position {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

let time_delay = 500;

let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let info = document.getElementById("info-text");

let secure_position = new Position(100, 100);
let score = 0;
let population = 100;
let generation = 0;
let networks = [];
let characters = [];
let saved_time = (new Date()).getTime();
alive = population;

setInterval(update, 10);
start();

function start(){
	canvas.setAttribute('width', window.innerWidth * 0.8);
	canvas.setAttribute('height', window.innerHeight * 0.8);
	for(let i = 0; i < population; i++){
		networks.push(new Network());
		characters.push(new Character(400, 300));
		networks[i].add_layer([4, 6, 2]);
	}
}

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
	
	for(let i = 0; i < population; i++){
		if(characters[i].is_alive){
			networks[i].calculate([((characters[i].position_x) / (window.innerWidth * 0.8)), ((secure_position.x + 100) / (window.innerWidth * 0.8)), ((characters[i].position_y) / (window.innerHeight * 0.8)), ((secure_position.y + 100) / (window.innerHeight * 0.8))]);
			characters[i].velocity_x = networks[i].layers[networks[i].layers.length - 1].neurons[0].value;
			characters[i].velocity_y = networks[i].layers[networks[i].layers.length - 1].neurons[1].value;
			characters[i].calculate();

			ctx.fillStyle = "#990000";
			ctx.fillRect(characters[i].position_x, characters[i].position_y, 25, 25);
		}
	}

	info.innerHTML = "<table><tr><td>score</td><td>" + score 
	+ "</td></tr><tr><td>alive</td><td>" + alive 
	+ "</td></tr><tr><td>generation</td><td>" + generation 
	+ "</td></tr></table>";
}

function reset_all(){
	update_secure();
	saved_time = (new Date()).getTime();
	score = 0;
	alive = population;
	generation++;
	
	for(let i = 0; i < population; i++){
		networks[i].next();
		characters[i].position_x = 500;
		characters[i].position_y = 250;
		characters[i].is_alive = true;
	}
}

function update_secure(){
	for(let i = 0; i < population; i++){
		if(Math.abs(secure_position.x + 100 - characters[i].position_x) > 100 || Math.abs(secure_position.y + 100 - characters[i].position_y) > 100){
			if(characters[i].is_alive){
				characters[i].is_alive = false;
				alive--;
			}
		}
	}

	if(alive > 0){
		score++;
	}

	secure_position.x = Math.round(Math.random() * window.innerWidth * 0.8);
	secure_position.y = Math.round(Math.random() * window.innerHeight * 0.8);
	if(secure_position.x > window.innerWidth * 0.8 - 200){
		secure_position.x -= 200;
	}
	if(secure_position.y > window.innerHeight * 0.8 - 200){
		secure_position.y -= 200;
	}
}