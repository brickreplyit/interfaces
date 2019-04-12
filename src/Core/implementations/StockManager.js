const assert = require('assert');
const abstraction = require('../../../lib/abstraction/Index');

function updateStockQuantityByType(stock, JSON_Key, piece_type, JSON_Key_To_Update, new_quantity){
    let updated = false;
    for (var i = 0; i < stock.length; i++) {
        if (stock[i][JSON_Key] === piece_type) {
            stock[i][JSON_Key_To_Update] = new_quantity;
            updated = false;
        }
    }
    return updated;
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

    async Get(){
        return this.Warehouse.stocks;
    }

    async CanProduce(consumption_items){
        
        let can_produce = true;

        for(let item of consumption_items){
            
            const stock_piece = await findPieceByType(this.Warehouse.stocks, 'piece', item.type);

            if(stock_piece.quantity < item.length)
                can_produce = false;
        }

        return can_produce;
    }

    /**
     * 
     * @param {*} pieces 
     * @param {*} consumptionItems 
     */
    async ProduceAndConsume(produced_pieces, consumptionItems){
        
        await this.Produce(produced_pieces.type, produced_pieces.length);

        for(let item = 0; item < consumptionItems.length; item++){
            assert('Should exists the consumption Item', consumptionItems[item]);
            await this.Consume(consumptionItems[item].type, (consumptionItems[item]).length);
        }
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Consume(piece_type, quantity)
    {
        const piece = await findPieceByType(this.Warehouse.stocks, 'piece', piece_type);

        await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', piece.quantity - quantity);
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
            return await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', piece.quantity + quantity);
        }
        
    }

    // /**
    //  * 
    //  * @param {*} piece_type 
    //  * @param {*} quantity 
    //  */
    // async Reserve(piece_type, quantity)
    // {
    //     const piece = await findPieceByType(this.Warehouse.stocks, 'piece', piece_type);

    //     if(undefined !== piece && null !== piece){
    //         if(piece.quantity > quantity){
    //             await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'reserved', piece.reserved + quantity);
    //             await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', (piece.quantity - quantity));
    //             return true;
    //         }
    //         else if(piece.quantity <= quantity && piece.quantity > 0){
    //             await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'reserved', piece.reserved + piece.quantity);
    //             await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', 0);
    //             return true;
    //         }
    //         else
    //             return false;
    //     }
    // }

    // /**
    //  * 
    //  * @param {*} piece_type 
    //  * @param {*} quantity 
    //  */
    // async ReserveRollback(piece_type, quantity)
    // {
    //     const piece = await findPieceByType(this.Warehouse.stocks, 'piece', piece_type);
    //     if(undefined !== piece && null !== piece){
    //         await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'reserved', piece.reserved - quantity);
    //         await updateStockQuantityByType(this.Warehouse.stocks, 'piece', piece_type, 'quantity', piece.quantity + quantity);
    //     }
    // }
}


module.exports = StockManager;