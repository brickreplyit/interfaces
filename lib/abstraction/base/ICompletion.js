const assert = require('assert');

/**
 * 
 */
class ICompletion{

    constructor(){}
    /** 
     * @param {*} pieces
     * @param {*} workId
     * @param {*} operationTrack
     * @param {*} consumptionItems
    */
    async SetComplete(pieces, workId, operationTrack, consumptionItems)
    {
        assert(false, `should not use interface ${pieces} ${workId} ${operationTrack} ${consumptionItems}`);
    }
    /**
     * 
     * @param {*} workId 
     */
    async GetPieces(workId)
    {
        assert(false, `shold not use interface ${workId}`);
    }
}

module.exports = ICompletion;