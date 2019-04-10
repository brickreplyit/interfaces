const abstraction = require('../../../lib/abstraction/Index');

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
        
        await this.StockManager.ProduceAndConsume(produced_pieces, consumptionItems);

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