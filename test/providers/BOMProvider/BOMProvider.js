const DB = require('./BOM.Data.json');

class BOMProvider{
    constructor(){
    }

    getBOM(){
        return DB.BOM;
    }
}

module.exports = BOMProvider;