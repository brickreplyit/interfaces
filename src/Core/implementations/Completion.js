const abstraction = require('../../../lib/abstraction');

class Completion extends abstraction.ICompletion{

    constructor(ITime, IStockManager){
        super();

        this.time = ITime;

        this.StockManager = IStockManager;

        this.result = {};

    }

    async SetComplete(pieces, workId, operationTrack, consumptionItems)
    {
        const produced_pieces = JSON.parse(JSON.stringify(pieces));
        
        //START SPOSTARE IN COMPLETION
        await this.StockManager.Produce(produced_pieces.type, produced_pieces.length);

        for(let item = 0; item < consumptionItems.length; item++){
            if(undefined !== item && null !== item)
                await this.StockManager.Consume(consumptionItems[item].type, (consumptionItems[item]).length);
        }
        //END SPOSTARE IN COMPLETION

        this.result[workId] =  { 
            time : this.time.getTime()
            , production :{
                pieces : produced_pieces
                , operationTrack
                , consumptionItems : consumptionItems
            }
        };
    }

    async GetPieces(workId){
        return this.result[workId];
    }
}

module.exports = Completion;