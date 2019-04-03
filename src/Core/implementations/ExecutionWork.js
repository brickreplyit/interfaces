const abstraction = require('../../../lib/abstraction/index');
const entities = require('../../../lib/entity');

class ExecutionWork extends abstraction.IExecutionWork{

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

        this.TestTimeIncremental = 0;
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

        if(operations.operations.length)
        {
            let work_pieces = JSON.parse(JSON.stringify(pieces));
            //this is a parent
            //this is a sequential parent
            for(let i = 0; i < operations.operations.length; i++)
            {
                const op = operations.operations[i];
                const IExecWork = this.child_operations[op.type];
                
                await IExecWork.Work(work_pieces, ICompletion, op.name);

                const worked = await ICompletion.GetPieces(op.name);
                work_pieces = worked.production.pieces;
            }

            await ICompletion.SetComplete(pieces, workID, {}, []);

        }else
        {
            this.time.date += this.TestTimeIncremental;

            let piece_type = workID;
            let real_production_capacity = 200;

            if(undefined !== operations.outputs){
                piece_type = operations.outputs[0].type;
                real_production_capacity = operations.outputs[0].capacity;
            }

            switch(workID)
            {

            case 'AVV':
                piece_type = 'outAvv';
                break;
            case 'PRS':
                piece_type = 'outPrs';
                break;
            case 'TRM':
                piece_type = 'outTrm';
                break;
            case 'ASS':
                piece_type = 'Finished';
                break;
            }

            const bom = await this.Bom.GetBom(piece_type, workID);

            const consumed_items = [];

            if(undefined !== bom.inputs)
            {
                for(let inp = 0; inp < bom.inputs.length; inp++)
                {
                    var pieceToConsume = bom.inputs[inp];

                    const consumed = (pieceToConsume.quantity) * real_production_capacity;

                    await this.StockManager.Reserve(pieceToConsume.type, consumed);

                    consumed_items.push(new entities.Pieces(consumed, pieceToConsume.type));
                }
            }
            //this is a child
            await ICompletion.SetComplete(new entities.Pieces(real_production_capacity, piece_type), workID, {}, consumed_items);
        }


    }
}

module.exports = ExecutionWork;