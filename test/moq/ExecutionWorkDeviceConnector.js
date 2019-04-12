const Device = require('./ExecutionWorkDevice');

class ExecutionWorkDeviceConnector {

    constructor(MQTT_BROKER, whoIam){
        
        this.MQTT_BROKER = MQTT_BROKER;

        this.topic_end = `${whoIam}_DEVICE_END`;

        this.topic_start = `${whoIam}_DEVICE_START`;

        this.Device = new Device(this.topic_start, this.topic_end);

        this.Device.Init();
    }

    Start(pieces, works_to_execute){
        const message = {
            pieces
            , works_to_execute
        };

        this.MQTT_BROKER.Publish(this.topic_start, message);

        this.MQTT_BROKER.Init([this.topic_end]);
    }

    /**
     * 
     * @param {*} function_to_execute logic for the return message 
     */
    End(function_to_execute){
        this.MQTT_BROKER.RegisterMessageLogic(function_to_execute);
    }

    Destroy(){
        this.MQTT_BROKER.End();

        this.Device.Destroy();
    }
}

module.exports = ExecutionWorkDeviceConnector;