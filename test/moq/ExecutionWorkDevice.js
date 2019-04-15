const common = require('../../src/App/common/common');
const MQTT = require('../../src/App/infrastructure/mqtt/mqtt');
const config = global.gConfig;
const conn_string = config.test.integration.MQTT_ENDPOINT;

class ExecutionWorkDevice {
    
    constructor(topic_in, topic_out){
        this.MQTT_DEVICE_BROKER = new MQTT(common.MQTT_LOGGER, conn_string);
        
        this.topic_in = topic_in;

        this.topic_out = topic_out;
    }

    Init(){
        this.MQTT_DEVICE_BROKER.Init([this.topic_in]);

        this.MQTT_DEVICE_BROKER.RegisterMessageLogic((topic, message) => {
            this.Work(JSON.parse(message.toString()).pieces.length);
        });
    }

    Work(length){
        this.MQTT_DEVICE_BROKER.Publish(this.topic_out, { worked: 'OK', qta : length});
    }

    Destroy(){
        this.MQTT_DEVICE_BROKER.End();
    }
}

module.exports = ExecutionWorkDevice;