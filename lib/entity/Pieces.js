class Pieces {
    
    constructor(length, type){
        this.length = length;
        this.type = type;
    }

    get count(){return this.length;}
}

module.exports = Pieces;