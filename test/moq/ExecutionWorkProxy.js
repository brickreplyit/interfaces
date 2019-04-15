const ExecutionWorkDeviceConnector = require('./ExecutionWorkDeviceConnector');
const abstraction = require('../../lib/abstraction/Index');
const entities = require('../../lib/entity/Index');
const common = require('../../src/App/common/common');
const MQTT = require('../../src/App/infrastructure/mqtt/mqtt');
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
        const connector = new ExecutionWorkDeviceConnector(new MQTT(common.MQTT_LOGGER, conn_string), this.whoIam);

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
}
    
module.exports = ExecutionWorkProxy;