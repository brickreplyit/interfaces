const assert = require('assert');

module.exports = class ITime{
    constructor(){}

    getTime(){
        assert(false, 'should not use interface');
    }
};