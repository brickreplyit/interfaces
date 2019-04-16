const ExecutionWorkDeviceConnector = require('../../server/core/infrastructure/connectors/DeviceConnector');
const ExecutionWorkManualConnector= require('../../server/core/infrastructure/connectors/ManualConnector');
const abstraction = require('../../lib/abstraction/Index');
const entities = require('../../lib/entity/Index');
const common = require('../../server/core/common/common');
const MQTT = require('../../server/core/infrastructure/mqtt/mqtt');
const config = global.gConfig;
const conn_string = config.test.integration.MQTT_ENDPOINT;

class ExecutionWorkProxy extends abstraction.IExecutionWork{
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

        this.time.date += this.TestTimeIncremental;
    
        let piece_type = workID;
        let real_production_capacity = 200;
    
        if(undefined !== operations.outputs){
            piece_type = operations.outputs[0].type;
            real_production_capacity = operations.outputs[0].capacity;
        }
    
        const bom = await this.Bom.GetBom(piece_type, workID);
    
        const consumed_items = [];
    
        if(undefined !== bom.inputs)
        {
            for(let inp = 0; inp < bom.inputs.length; inp++)
            {
                var pieceToConsume = bom.inputs[inp];
    
                const consumed = (pieceToConsume.quantity) * real_production_capacity;
    
                consumed_items.push(new entities.Pieces(consumed, pieceToConsume.type));
            }
        }

        const work_mode = await this.operations.GetOperationWorkMode(workID);

        switch(work_mode){
        case 'DEVICE' :
            return this.WorkDevice(ICompletion, real_production_capacity, piece_type, operations, workID, consumed_items);
        case 'MANUAL' :
            return this.WorkManual(ICompletion, real_production_capacity, piece_type, operations, workID, consumed_items);
        default : 
            return this.WorkStandard(ICompletion, real_production_capacity, piece_type, operations, workID, consumed_items);
        }
    }

    WorkManual(ICompletion, real_production_capacity, piece_type, operations, workID, consumed_items){
        const connector = new ExecutionWorkManualConnector(new MQTT(common.MQTT_LOGGER, conn_string), this.whoIam, 'mongodb://0.0.0.0:27017/');

        connector.Start(new entities.Pieces(real_production_capacity, piece_type), operations.works);

        return new Promise((resolve, reject) => {
            connector.End((topic, message) => {    
                ICompletion.SetComplete(new entities.Pieces(real_production_capacity, piece_type), workID, {}, consumed_items).then(() => { 
                    connector.Destroy();

                    resolve(); 
                }).catch((err) => { reject(err); });

            });
        });
    }

    WorkDevice(ICompletion, real_production_capacity, piece_type, operations, workID, consumed_items){
        const connector = new ExecutionWorkDeviceConnector(new MQTT(common.MQTT_LOGGER, conn_string), this.whoIam);

        connector.Start(new entities.Pieces(real_production_capacity, piece_type), operations.works);

        return new Promise((resolve, reject) => {
            connector.End((topic, message) => {    
                ICompletion.SetComplete(new entities.Pieces(real_production_capacity, piece_type), workID, {}, consumed_items).then(() => { 
                    connector.Destroy();

                    resolve(); 
                }).catch((err) => { reject(err); });

            });
        });
    }

    async WorkStandard(ICompletion, real_production_capacity, piece_type, operations, workID, consumed_items){
        return await ICompletion.SetComplete(new entities.Pieces(real_production_capacity, piece_type), workID, {}, consumed_items);
    }
}
    
module.exports = ExecutionWorkProxy;