const IExecutionWork = require('../../../lib/abstraction/IExecutionWork');
const Pieces = require('../../../lib/entity/Pieces');

class ExecutionWork extends IExecutionWork{

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

            await ICompletion.SetComplete(this.StockManager, pieces, workID, {}, []);

        }else
        {
            this.time.date += 1440 * 60 * 1000;

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

                    const stock_quantity = (await this.StockManager.GetStockByPieceType(pieceToConsume.type)).quantity;

                    const consumed = (pieceToConsume.quantity) * real_production_capacity;

                    consumed_items.push({
                        type : pieceToConsume.type
                        , ConsumedQuantity : consumed
                        , RemainingQuantity : stock_quantity - consumed
                    });
                }
            }

            const produced_quantity = (await this.StockManager.GetStockByPieceType(piece_type)).quantity;
            
            await this.StockManager.Push(piece_type, produced_quantity + real_production_capacity);

            //this is a child
            await ICompletion.SetComplete(this.StockManager, new Pieces(real_production_capacity, piece_type), workID, {}, consumed_items);
        }


    }
}

module.exports = ExecutionWork;