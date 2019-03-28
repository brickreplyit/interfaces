const ICompletion = require('../../../lib/abstraction/base/ICompletion');

class Completion extends ICompletion{

    constructor(ITime){
        super();

        this.time = ITime;

        this.result = {};
    }

    async SetComplete(pieces, workId, operationTrack, consumptionItems)
    {
        //pieces.type = workId;

        this.result[workId] =  { 
            time : this.time.getTime()
            , production :{
                pieces : JSON.parse(JSON.stringify(pieces))
                , operationTrack
                , consumptionItems
            }
           
            
        };

       


    }

    async GetPieces(workId){
        return this.result[workId];
    }
}

module.exports = Completion;