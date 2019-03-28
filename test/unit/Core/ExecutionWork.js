const IExecutionWork = require('../../../lib/abstraction/IExecutionWork');
const Pieces = require('../../../lib/entity/Pieces');

class ExecutionWork extends IExecutionWork{

    constructor(whoIam, IOperations, child_operations, ITime, IBom){
        super();

        this.whoIam = whoIam;
        
        this.child_operations = child_operations;

        this.operations = IOperations;

        this.time = ITime;

        this.Bom = IBom;
    }

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

            await ICompletion.SetComplete(pieces, workID, {}, {});

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

            const bom = await this.Bom.getBom(piece_type, workID);

            // for(let inp = 0; inp < bom.inputs.length; inp++)
            // {
                
            // }

            //this is a child
            await ICompletion.SetComplete(new Pieces(real_production_capacity, piece_type), workID, {}, {});
        }


    }
}

module.exports = ExecutionWork;