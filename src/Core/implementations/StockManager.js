const abstraction = require('../../../lib/abstraction/index');

function updateStockQuantityByType(stock, JSON_Key, piece_type, JSON_Key_To_Update, new_quantity){
    for (var i = 0; i < stock.length; i++) {
        if (stock[i][JSON_Key] === piece_type) {
            stock[i][JSON_Key_To_Update] = new_quantity;
            return true;
        }
    }
    return false;
}

function findPieceByType(stock, JSON_Key, piece_type) {
    for (var i = 0; i < stock.length; i++) {
        if (stock[i][JSON_Key] === piece_type) {
            return stock[i];
        }
    }
    return null;
}

class StockManager extends abstraction.IStockManager{
    
    constructor(){
        super();

        this.Warehouse = {
            name : 'plant_warehouse'
            , stocks : [
                { piece: 'Plast A', quantity : 5000, reserved : 0 }
                , { piece: 'Plast B', quantity :  5000, reserved : 0  }
                , { piece: 'Rame', quantity :  5000, reserved : 0  }
                , { piece: 'Faston', quantity :  5000, reserved : 0  }
                , { piece: 'Plast C', quantity :  5000, reserved : 0  }
                , { piece: 'Color', quantity :  5000, reserved : 0  }
                , { piece: 'Min', quantity :  5000, reserved : 0  }
                , { piece: 'outArr', quantity : 0, reserved : 0  }
                , { piece: 'outAvv', quantity : 0, reserved : 0  }
                , { piece: 'outPrs', quantity : 0, reserved : 0  }
                , { piece: 'outTrm', quantity : 0, reserved : 0  }
                , { piece: 'Finished', quantity : 0, reserved : 0  }
            ]
        };
    }

    async GetCurrentStock(){
        return this.Warehouse.stocks;
    }
    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Consume(piece_type, quantity)
    {
        const piece = await findPieceByType(this.Warehouse.stocks, 'piece', piece_type);

        if(undefined !== piece && null !== piece){
            await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'reserved', piece.reserved - quantity);
        }
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Produce(piece_type, quantity)
    {
        const piece = await findPieceByType(this.Warehouse.stocks, 'piece', piece_type);

        if(undefined !== piece && null !== piece){
            return updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', piece.quantity + quantity);
        }
        
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Reserve(piece_type, quantity)
    {
        const piece = await findPieceByType(this.Warehouse.stocks, 'piece', piece_type);

        if(undefined !== piece && null !== piece){
            if(piece.quantity > quantity){
                await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'reserved', piece.reserved + quantity);
                return updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', (piece.quantity - quantity));
            }
            else {
                await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'reserved', piece.reserved + piece.quantity);
                return updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', 0);
            }
        }

       
    }
}


module.exports = StockManager;