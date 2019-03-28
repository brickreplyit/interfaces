var DB = require('./Warehouse.Data.json');

class WarehouseProvider{
    constructor(){
    }

    getWarehouses(){
        return DB.Warehouses;
    }
}

module.exports = WarehouseProvider;