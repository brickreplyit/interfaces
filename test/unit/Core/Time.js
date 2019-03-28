const ITime = require('../../../lib/abstraction/base/ITime');

module.exports = class Time extends ITime{
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