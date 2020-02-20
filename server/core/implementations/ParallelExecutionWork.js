const abstraction = require('../../../lib/abstraction/Index');

class ParallelExecutionWork extends abstraction.IExecutionWork{
    /**
     * 
     * @param {*} whoIam 
     * @param {*} IOperations 
     * @param {*} child_operations 
     * @param {*} ITime 
     * @param {*} IBom 
     * @param {*} IStockManager 
     */
    constructor(whoIam, IOperations, child_operations, ITime, IBom, IStockManager){
        super();

        this.whoIam = whoIam;
        
        this.child_operations = child_operations;

        this.operations = IOperations;

        this.time = ITime;

        this.Bom = IBom;

        this.StockManager = IStockManager;
    }

    /**
     * 
     * @param {*} pieces 
     * @param {*} ICompletion 
     * @param {*} workID 
     */
    async Work(pieces, ICompletion, workID)
    {
        const operations = await this.operations.GetOperation(pieces, workID);

        
        let work_pieces = JSON.parse(JSON.stringify(pieces));

        const child_promises = [];
        //this is a parent
        //this is a sequential parent
        for(let i = 0; i < operations.operations.length; i++)
        {
            const op = operations.operations[i];
            const IExecWork = this.child_operations[op.type];
                
            const promise = IExecWork.Work(work_pieces, ICompletion, op.name);
            
            child_promises.push(promise);

            // const worked = await ICompletion.GetPieces(op.name);
            // work_pieces = worked.production.pieces;
        }

        await Promise.all(child_promises);

        await ICompletion.SetComplete(pieces, workID, {}, []);

        


    }
}

module.exports = ParallelExecutionWork;