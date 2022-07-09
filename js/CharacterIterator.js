class CharacterIterator{
    constructor(_character){
        this.first_character = _character;
        this.current_character = _character;
    }

    next(){
        if(this.current_character.next == null)
            return false;
        this.current_character = this.current_character.next;
        return true;
    }

    get(){
        return this.current_character;
    }

    reset(){
        this.current_character = this.first_character;
    }
}