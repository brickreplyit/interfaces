const ICompletion = require('../../../lib/abstraction/base/ICompletion');
const Pieces = require('../../../lib/entity/Pieces');

class Completion extends ICompletion{

    constructor(ITime){
        super();

        this.time = ITime;

        this.result = {};
    }

    async SetComplete(IStockManager, pieces, workId, operationTrack, consumptionItems)
    {
        this.result[workId] =  { 
            time : this.time.getTime()
            , production :{
                pieces : JSON.parse(JSON.stringify(pieces))
                , operationTrack
                , consumptionItems : await this.ConsumeItems(IStockManager, consumptionItems)
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