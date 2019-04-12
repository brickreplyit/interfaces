const executionWorkStub = require('./ExecutionWorkStub');
const abstraction = require('../../lib/abstraction/Index');
const entities = require('../../lib/entity/Index');
const common = require('../../src/App/common/common');
const mqtt = require('../../src/App/infrastructure/mqtt/asyncMqtt');
const config = global.gConfig;
const conn_string = config.test.integration.MQTT_ENDPOINT || 'mqtt://0.0.0.0:1883';

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

        this.MQTT_CLIENT = new mqtt(common.MQTT_LOGGER, conn_string);
        
    }

    async Connect(ICompletion){
        await this.MQTT_CLIENT.Init([this.whoIam + '_RESPONSE']);

        this.MQTT_CLIENT.RegisterMessageLogic(async (topic, message) => {
            console.log('Proxy received');
            const result = JSON.parse(message.toString());

            await ICompletion.SetComplete(new entities.Pieces(result.real_production_capacity, result.piece_type), result.workID, {}, result.consumed_items);

            await this.MQTT_CLIENT.Publish(this.whoIam + '_COMPLETED', { ICompletion });
        }); 
    }

    /**
     * 
     * @param {*} pieces 
     * @param {*} ICompletion 
     * @param {*} workID 
     */
    async Work(pieces, ICompletion, workID)
    {
        const stub = new executionWorkStub(this.whoIam, this.operations, this.child_operations || [], this.time, this.Bom, this.StockManager);

        await stub.Connect(); 

        await this.Connect(ICompletion);

        const message = {
            pieces_lst : pieces
            , completion : ICompletion
            , work_id : workID 
        };

        await this.MQTT_CLIENT.Publish(this.whoIam + '_REQUEST', message);
    }
}

module.exports = ExecutionWorkProxy;