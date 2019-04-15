const abstraction = require('../../../lib/abstraction/Index');

module.exports = class Time extends abstraction.ITime{
    constructor(date){
        super();

        if(undefined === date) 
            date = new Date();
        
        this.date = date; 
    }

    getTime(){
        return this.date;
    }
};