const dbg = require('debug')('platform:abstraction:test');

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
                await this.StockManager.Consume(consumptionItems[item].type, (consumptionItems[item]).length);
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

    async GetPieces(workId){
        return this.result[workId];
    }
}

module.exports = Completion;