class Character{
    constructor(x, y){
        this.position_x = x;
        this.position_y = y;
        this.velocity_x = 0;
        this.velocity_y = 0;
        this.next = null;
    }

    add(_character){
        let temp = this;
        while(temp.next != null){
            temp = temp.next;
        }
        temp.next = _character;
    }
}