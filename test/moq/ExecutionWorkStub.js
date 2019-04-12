const assert = require('assert');
const abstraction = require('../../lib/abstraction/Index');
const entities = require('../../lib/entity/Index');
const common = require('../../src/App/common/common');
const mqtt = require('../../src/App/infrastructure/mqtt/asyncMqtt');
const config = global.gConfig;
const conn_string = config.test.integration.MQTT_ENDPOINT || 'mqtt://0.0.0.0:1883';

class ExecutionWorkStub extends abstraction.IExecutionWork{

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

    async Connect(){
        await this.MQTT_CLIENT.Init([this.whoIam + '_REQUEST']);

        this.MQTT_CLIENT.RegisterMessageLogic(async (topic, message) => {
            console.log('Stb receive' + topic);
            message = JSON.parse(message.toString());
            await this.Work(message.pieces_lst, message.completion, message.work_id);
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

        const can_produce = await this.StockManager.CanProduce(consumed_items);

        var message = {
            can_produce
            , real_production_capacity
            , piece_type
            , workID
            , consumed_items
            , ICompletion
        };

        await this.MQTT_CLIENT.Publish(this.whoIam + '_RESPONSE', message);
    }
}

module.exports = ExecutionWorkStub;