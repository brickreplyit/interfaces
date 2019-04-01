const IStockManager = require('../../../lib/abstraction/base/IStockManager');

function updateObjectByKey(array, key, value, fieldToUpdate, newValue){
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            array[i][fieldToUpdate] = newValue;
            return true;
        }
    }
    return false;
}

function findObjectByKey(array, key, value) {
    for (var i = 0; i < array.length; i++) {
        if (array[i][key] === value) {
            return array[i];
        }
    }
    return null;
}

class StockManager extends IStockManager{
    
    constructor(){
        super();

        this.Warehouse = {
            name : 'plant_warehouse'
            , stocks : [
                { piece: 'Plast A', quantity : 5000 }
                , { piece: 'Plast B', quantity :  5000 }
                , { piece: 'Rame', quantity :  5000 }
                , { piece: 'Faston', quantity :  5000 }
                , { piece: 'Plast C', quantity :  5000 }
                , { piece: 'Color', quantity :  5000 }
                , { piece: 'Min', quantity :  5000 }
                , { piece: 'outArr', quantity : 0 }
                , { piece: 'outAvv', quantity : 0 }
                , { piece: 'outPrs', quantity : 0 }
                , { piece: 'outTrm', quantity : 0 }
                , { piece: 'Finished', quantity : 0 }
            ]
        };
    }

    async GetStock()
    {
        return this.Warehouse.stocks;
    }

    /**
     * 
     * @param {*} piece_type 
     */
    async GetStockByPieceType(piece_type)
    {
        return findObjectByKey(this.Warehouse.stocks, 'piece', piece_type);
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Consume(piece_type, quantity)
    {
        return updateObjectByKey(this.Warehouse.stocks, 'piece', piece_type, 'quantity', quantity);
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Push(piece_type, quantity)
    {
        return updateObjectByKey(this.Warehouse.stocks, 'piece', piece_type, 'quantity', quantity);
    }
}


module.exports = StockManager;