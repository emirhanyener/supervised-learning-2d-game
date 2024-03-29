class Position {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

document.addEventListener("keydown", key_down_fn);

let time_delay = 500;

let window_width = window.innerWidth;
let window_height = window.innerHeight;
let canvas = document.getElementById("canvas");
let ctx = canvas.getContext("2d");
let info = document.getElementById("info-text");
let status_select = document.getElementById("status-select");

let secure_position = new Position(100, 100);
let score = 0;
let population = 10;
let generation = 0;
let networks = [];
let characters = [];
let saved_time = (new Date()).getTime();
alive = population;

setInterval(update, 10);
start();

//init values
function start(){
	for(let i = 0; i < population; i++){
		networks.push(new Network());
		characters.push(new Character(window_width / 2, window_height / 2));
		networks[i].add_layer([4, 6, 8, 2]);
		status_select.innerHTML += "<option value = \"" + i + "\">" + "character (" + (i + 1) + ") network</option>";
	}
}

//main frame update function
function update(){
	window_width = canvas.clientWidth;
	window_height = canvas.clientHeight;
	canvas.setAttribute("width", window_width);
	canvas.setAttribute("height", window_height);
	const d = new Date();

	if(d.getTime() - saved_time > time_delay){
		update_secure();
		saved_time = d.getTime();
	}

	if(alive <= 0){
		reset_all();
		return;
	}

	
	for(let i = 0; i < population; i++){
		if(characters[i].is_alive){
			networks[i].calculate([((characters[i].position_x) / (window_width)), ((secure_position.x) / (window_width)), ((characters[i].position_y) / (window_height)), ((secure_position.y) / (window_height))]);
			characters[i].velocity_x = networks[i].layers[networks[i].layers.length - 1].neurons[0].value;
			characters[i].velocity_y = networks[i].layers[networks[i].layers.length - 1].neurons[1].value;
			characters[i].calculate();
		}
	}

	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, window_width, window_height);

	if(status_select.value == "game"){
		ctx.fillStyle = "#FFFFFF";
		ctx.beginPath();
		ctx.fillStyle = "#00FF0080";
		ctx.arc(secure_position.x, secure_position.y, 100, 0, 2 * Math.PI);
		ctx.fill();
		
		for(let i = 0; i < population; i++){
			if(characters[i].is_alive){
				ctx.beginPath();
				ctx.moveTo(characters[i].position_x, characters[i].position_y);
				ctx.lineTo(secure_position.x, secure_position.y);
				ctx.strokeStyle = "#FFFFFF05";
				ctx.stroke();
				ctx.beginPath();
				ctx.fillStyle = "#FF000080";
				ctx.arc(characters[i].position_x, characters[i].position_y, 8, 0, 2 * Math.PI);
				ctx.fill();
			}
			else{
				ctx.beginPath();
				ctx.fillStyle = "#FFFFFF10";
				ctx.arc(characters[i].position_x, characters[i].position_y, 8, 0, 2 * Math.PI);
				ctx.fill();
			}
		}

		ctx.fillStyle = "#AAAAAA";
		ctx.font = "26px Verdana";
		ctx.fillText("alive " + alive, 50, 50);
		ctx.fillText("score " + score, 50, 80);
		ctx.fillText("time delay " + time_delay, 50, 110);
	}
	else if(status_select.value == "best"){
		for(let i = 0; i < population; i++){
			if(characters[i].is_alive){
				ctx.fillStyle = "#AAAAAA";
				ctx.font = "26px Verdana";
				ctx.fillText("character " + (i + 1) + " neural network;", 50, 50);
				ctx.fillStyle = "#FFF";
				ctx.strokeStyle = "#0000FF80";
				for(let x = networks[i].layers.length - 1; x >= 0; x--){
					for(let y = networks[i].layers[x].neurons.length - 1; y >= 0; y--){
						ctx.beginPath();
						ctx.arc(100 + x * 300, 130 + y * 70, 10, 0, 2 * Math.PI);
						ctx.fill();
						for(let w = 0; w < networks[i].layers[x].neurons[y].weights.length; w++){
							ctx.beginPath();
							ctx.moveTo(85 + x * 300, 130 + y * 70);
							ctx.lineWidth = networks[i].layers[x].neurons[y].weights[w] * 10;
							ctx.lineTo(115 + (x - 1) * 300, 130 + w * 70);
							ctx.stroke();
						}
					}
				}
				break;
			}
		}
	}
	else{
		ctx.fillStyle = "#AAAAAA";
		ctx.font = "26px Verdana";
		ctx.fillText("character " + (parseInt(status_select.value) + 1) + " neural network;", 50, 50);
		ctx.fillStyle = "#FFF";
		ctx.strokeStyle = "#0000FF80";
		for(let x = networks[parseInt(status_select.value)].layers.length - 1; x >= 0; x--){
			for(let y = networks[parseInt(status_select.value)].layers[x].neurons.length - 1; y >= 0; y--){
				ctx.beginPath();
				ctx.arc(100 + x * 300, 130 + y * 70, 10, 0, 2 * Math.PI);
				ctx.fill();
				for(let w = 0; w < networks[parseInt(status_select.value)].layers[x].neurons[y].weights.length; w++){
					ctx.beginPath();
					ctx.moveTo(85 + x * 300, 130 + y * 70);
					ctx.lineWidth = networks[parseInt(status_select.value)].layers[x].neurons[y].weights[w] * 10;
					ctx.lineTo(115 + (x - 1) * 300, 130 + w * 70);
					ctx.stroke();
				}
			}
		}
	}
}

//resets all values
function reset_all(){
	update_secure();
	saved_time = (new Date()).getTime();
	score = 0;
	alive = population;
	generation++;
	
	for(let i = 0; i < population; i++){
		networks[i].next();
		characters[i].position_x = window_width / 2;
		characters[i].position_y = window_height / 2;
		characters[i].is_alive = true;
	}
}

//random secure area position
function update_secure(){
	for(let i = 0; i < population; i++){
		if(Math.sqrt(Math.pow(secure_position.x - characters[i].position_x, 2) + Math.pow(secure_position.y - characters[i].position_y, 2)) > 100){
			if(characters[i].is_alive){
				characters[i].is_alive = false;
				alive--;
			}
		}
	}

	if(alive > 0){
		score++;
	}

	secure_position.x = Math.round(Math.random() * window_width);
	secure_position.y = Math.round(Math.random() * window_height);
	if(secure_position.x > window_width - 200){
		secure_position.x -= 200;
	}
	if(secure_position.y > window_height - 200){
		secure_position.y -= 200;
	}
}

//key down event
function key_down_fn(e){
	if(e.code == "ArrowRight"){
		if(time_delay > 90) {
			time_delay += 100;
		}
		else {
			time_delay += 10;
		}
	}
	if(e.code == "ArrowLeft"){
		if(time_delay > 100) {
			time_delay -= 100;
		}
		else {
			if(time_delay > 50){
				time_delay -= 10;
			}
		}
	}
	if(e.code == "ArrowUp"){
		networks.push(new Network());
		characters.push(new Character(window_width / 2, window_height / 2));
		networks[population].add_layer([4, 6, 8, 2]);
		status_select.innerHTML += "<option value = \"" + population + "\">" + "character (" + (population + 1) + ") network</option>";
		population++;
	}
}