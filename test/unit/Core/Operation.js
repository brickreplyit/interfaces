const IOperation = require('../../../lib/abstraction/base/IOperation');
const Pieces = require('../../../lib/entity/Pieces');

function filter_operations(ops, target)
{
    if(ops.name == target)
        return ops;

    if(undefined === ops.operations)
        return null;

    for(let i = 0; ops.operations.length; i++)
    {
        const op = ops.operations[i];

        let op_target = filter_operations(op, target);
        if(null != op_target)
            return op_target;
    }
}

class Operation extends IOperation {
    constructor(){
        super();

        this.ops = {
           
            name : 'plant'
            , type : 'parent'
            , operations : [
                {  
                    name: 'ARR'
                    , type : 'ARR'
                    , operations : []
                    , works : []
                    , outputs : [
                        { 
                            type: 'outArr'
                            , capacity : 200
                        }
                    ]
                       
                }
                , {
                       
                    name: 'AVV'
                    , type : 'ARR'
                    , operations : []
                       
                }
                , {
                       
                    name: 'PRS'
                    , type : 'ARR'
                    , operations : []
                       
                }
                , {
                       
                    name: 'TRM'
                    , type : 'ARR'
                    , operations : []
                       
                }
                , {
                       
                    name: 'ASS'
                    , type : 'ARR'
                    , operations : []
                       
                }
            ]
          
        };
    }

    async GetOperation(pieces, workId)
    {
        const operation = filter_operations(this.ops, workId);

        return operation;  
        
    }
}

module.exports = Operation;

