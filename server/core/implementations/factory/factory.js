const SequentialExecutionWork = require('../../Index').SequentialExecutionWork;
const ParallelExecutionWork = require('../../Index').ParallelExecutionWork;

class ExecutionWorkFactory {

    constructor(){}

    GetExecutionWork(whoIam, IOperations, child_operations, ITime, IBom, IStockManager){
        switch(next_operation.child_join_type){
        case 'sequential':
            return this.GetSequentialExecutionWork(whoIam, IOperations, child_operations, ITime, IBom, IStockManager);
        case 'parallel':
            return this.ParallelExecutionWork(whoIam, IOperations, child_operations, ITime, IBom, IStockManager);
        }
    }

    GetSequentialExecutionWork(whoIam, IOperations, child_operations, ITime, IBom, IStockManager){
        return new SequentialExecutionWork(whoIam, IOperations, child_operations, ITime, IBom, IStockManager);
    }

    GetParallelExecutionWork(whoIam, IOperations, child_operations, ITime, IBom, IStockManager){
        return new ParallelExecutionWork(whoIam, IOperations, child_operations, ITime, IBom, IStockManager);
    }

}

module.exports = ExecutionWorkFactory;