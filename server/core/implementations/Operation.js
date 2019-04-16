const abstraction = require('../../../lib/abstraction/Index');

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

class Operation extends abstraction.IOperation {
    constructor(){
        super();

        this.ops = {
           
            name : 'plant'
            , type : 'parent'
            , child_join_type : 'sequential'
            , operations : [
                {  
                    name: 'ARR'
                    , type : 'ARR'
                    //, operations : []
                    , works : []
                    , outputs : [
                        { 
                            type: 'outArr'
                            , capacity : 200
                        }
                    ]
                    , mode : 'DEVICE'
                       
                }
                , {
                       
                    name: 'AVV'
                    , type : 'AVV'
                    , operations : []
                    , works : []
                    , outputs : [
                        { 
                            type: 'outAvv'
                            , capacity : 200
                        }
                    ]
                    , mode : 'DEVICE'
                       
                }
                , {
                       
                    name: 'PRS'
                    , type : 'PRS'
                    , operations : []
                    , works : []
                    , outputs : [
                        { 
                            type: 'outPrs'
                            , capacity : 200
                        }
                    ]
                    , mode : 'DEVICE'
                       
                }
                , {
                       
                    name: 'TRM'
                    , type : 'TRM'
                    , operations : []
                    , works : []
                    , outputs : [
                        { 
                            type: 'outTrm'
                            , capacity : 200
                        }
                    ]
                    , mode : 'DEVICE'
                       
                }
                , {
                       
                    name: 'ASS'
                    , type : 'ASS'
                    , operations : []
                    , works : []
                    , outputs : [
                        { 
                            type: 'Finished'
                            , capacity : 200
                        }
                    ]
                    , mode : 'DEVICE'
                       
                }
            ]
          
        };
    }

    async GetOperation(pieces, workId)
    {
        const operation = filter_operations(this.ops, workId);

        return operation;  
        
    }

    async GetOperationWorkMode(workId){
        return (await this.GetOperation(null, workId)).mode;
    }
}

module.exports = Operation;

