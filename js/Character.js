class Character{
    constructor(x, y){
        this.position_x = x;
        this.position_y = y;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.is_alive = true;
        this.speed = 25;
    }

    //calculates new position
    calculate(){
        this.position_x += this.velocity_x * this.speed;
        this.position_y += this.velocity_y * this.speed;
    }
}