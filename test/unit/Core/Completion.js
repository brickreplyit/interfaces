const ICompletion = require('../../../lib/abstraction/base/ICompletion');
const Pieces = require('../../../lib/entity/Pieces');

class Completion extends ICompletion{

    constructor(ITime, IStockManager){
        super();

        this.time = ITime;

        this.StockManager = IStockManager;

        this.result = {};

    }

    async SetComplete(pieces, workId, operationTrack, consumptionItems)
    {
        const produced_pieces = JSON.parse(JSON.stringify(pieces));

        await this.StockManager.Produce(produced_pieces.type, produced_pieces.length);

        for(let item = 0; item < consumptionItems.length; item++){
            if(undefined !== item && null !== item)
                await this.StockManager.Consume(consumptionItems[item].type, consumptionItems[item].quantity);
        }

        this.result[workId] =  { 
            time : this.time.getTime()
            , production :{
                pieces : produced_pieces
                , operationTrack
                , consumptionItems : consumptionItems
            }
        };
    }

    async ConsumeItems(IStockManager, consumptionItems)
    {
        const res = [];

        for(const consumptionItem of consumptionItems){
            await IStockManager.Consume(consumptionItem.type, consumptionItem.RemainingQuantity);
            res.push(new Pieces(consumptionItem.ConsumedQuantity, consumptionItem.type));
        }

        return res;       
    }

    async GetPieces(workId){
        return this.result[workId];
    }
}

module.exports = Completion;