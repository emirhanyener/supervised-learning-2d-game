var canvas = document.getElementById("canvas");
canvas.setAttribute('width', window.innerWidth * 0.8);
canvas.setAttribute('height', window.innerHeight * 0.8);

var ctx = canvas.getContext("2d");

class Position {
	constructor(x, y){
		this.x = x;
		this.y = y;
	}
}

let secure_position = new Position(100, 100);

let x = 0;
let y = 100;
let speed = 2;
let score = 0;
let is_alive = true;

document.addEventListener('keydown', player_control_keydown);
document.addEventListener('keyup', player_control_keyup);

setInterval(update, 10);
setInterval(update_secure, 5000);


let list = new Character(300, 300);
let iterator = new CharacterIterator(list);

for(let i = 0; i < 49; i++){
	let temp = new Character(300, 300);
	temp.velocity_x = (Math.random() - 0.5) * 10;
	temp.velocity_y = (Math.random() - 0.5) * 10;
	list.add(temp);
}

let right = false;
let left = false;
let up = false;
let down = false;

function list_characters(){
	iterator.reset();

	while(iterator.next())
	{
		console.log(iterator.get());
	}
}

function update(){
	if(left){
		x -= speed;
	}
	if(right){
		x += speed;
	}
	if(up){
		y -= speed;
	}
	if(down){
		y += speed;
	}
	ctx.fillStyle = "#000000";
	ctx.fillRect(0, 0, window.innerWidth * 0.8, window.innerHeight * 0.8);
	ctx.fillStyle = "#009900";
	ctx.fillRect(secure_position.x, secure_position.y, 200, 200);
	
	iterator.reset();
	while(iterator.next()){
		ctx.fillStyle = "#990000";
		ctx.fillRect(iterator.get().position_x, iterator.get().position_y, 25, 25);
		iterator.get().calculate();
	}

	score++;
	document.getElementById("score-text").innerHTML = "score = " + score;
	if(!is_alive)
		document.getElementById("status-text").innerHTML = "status = dead";
}

function update_secure(){
	if(Math.abs(secure_position.x + 100 - x) > 100 || Math.abs(secure_position.y + 100 - y) > 100)
		is_alive = false;

	secure_position.x = Math.random() * window.innerWidth * 0.8;
	secure_position.y = Math.random() * window.innerHeight * 0.8;
	if(secure_position.x > window.innerWidth * 0.8 - 200)
		secure_position.x -= 200;
	if(secure_position.y > window.innerHeight * 0.8 - 200)
		secure_position.y -= 200;
}

function player_control_keydown(e){
	if(e.code == 'KeyA' || e.code == 'ArrowLeft'){
		left = true;
	}
	if(e.code == 'KeyD' || e.code == 'ArrowRight'){
		right = true;
	}
	if(e.code == 'KeyW' || e.code == 'ArrowUp'){
		up = true;
	}
	if(e.code == 'KeyS' || e.code == 'ArrowDown'){
		down = true;
	}
}
function player_control_keyup(e){
	if(e.code == 'KeyA' || e.code == 'ArrowLeft'){
		left = false;
	}
	if(e.code == 'KeyD' || e.code == 'ArrowRight'){
		right = false;
	}
	if(e.code == 'KeyW' || e.code == 'ArrowUp'){
		up = false;
	}
	if(e.code == 'KeyS' || e.code == 'ArrowDown'){
		down = false;
	}
}