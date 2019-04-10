const assert = require('assert');

/**
 * Interface for MQTT Broker
 */
class IMQTT {    
    
    constructor(){}

    /**
     * Initialize the MQTT Subscriber 
     * @param {*} topics 
     */
    Init(topics){
        assert(false, `should not use interface ${topics}`);
    }

    /**
     * associate the Publisher Logic
     * @param {*} function_to_execute 
     */
    RegisterMessageLogic(function_to_execute){
        assert(false, `should not use interface ${function_to_execute}`);
    }

    /**
     * Publish a Message
     * @param {*} topic 
     * @param {*} JSON_to_send 
     */
    Publish(topic, JSON_to_send){
        assert(false, `should not use interface ${topic} ${JSON_to_send}`);
    }

    /**
     * Close the client connection
     */
    End(){
        assert(false, 'should not use interface');
    }
}

module.exports = IMQTT;