const assert = require('assert');

/**
 * 
 */
class IOperation{

    constructor(){}
    /** 
     * @param {*} pieces continue input
     * @param {*} workId
    */
    async GetOperation(pieces, workId)
    {
        assert(false, `should not use interface ${pieces} ${workId}`)
    }
}

module.exports = IOperation;