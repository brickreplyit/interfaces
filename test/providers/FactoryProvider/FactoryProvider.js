const DB = require('./Factory.Data.json');

class FactoryProvider{
    constructor(){
    }

    getFactories(){
        return DB.Factories;
    }
}

module.exports = FactoryProvider;