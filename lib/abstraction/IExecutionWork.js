const assert = require('assert');
/**
 * 
 */
class IExecutionWork {    
    
    constructor(){}

    /** 
     * @param {*} IBom
     * @param {*} IOperation
     * @param {*} ICompletion
     * @param {*} lst_IExecutionWork
   
    async Setup(IBom, IOperation, ICompletion, lst_IExecutionWork)
    {
        assert(false, `should not use interface ${IBom} ${IOperation} ${ICompletion} ${lst_IExecutionWork}`);
    } */

    /** 
     * @param {*} time
     * @param {*} pieces
    */
    async Work(pieces, ICompletion, workID)
    {
        assert(false, `should not use interface ${pieces}`);
    }
}

module.exports = IExecutionWork;