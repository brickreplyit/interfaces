const async_mqtt = require('async-mqtt'); 
const abstractions = require('../../../../lib/abstraction/Index');
const assert = require('assert');

/** 
 * Implementation of MQTT.js
*/
class ASYNC_MQTT extends abstractions.IMQTT{

    /**
     * MQTT Constructor
     * @param {*} logger 
     * @param {*} mqtt_endpoint 
     */
    constructor(logger, mqtt_endpoint){
        super();
        this.endpoint = mqtt_endpoint;
        this.logger = logger;
        this.client = async_mqtt.connect(mqtt_endpoint);
    }

    /**
     * Initialize the MQTT Subscriber 
     * @param {*} topics 
     */
    async Init(topics){
        assert(topics);
        this.client = await async_mqtt.connect(this.mqtt_endpoint);
        await this.SubscribeAll(topics);
    }

    /**
     * Subscribe to all TOPICS
     * @param {*} topics 
     */
    async SubscribeAll(topics){
        this.client.on('connect', async () => {
            this.logger.info(`MQTT Subscriber Client Connected -> ${new Date()}`);
            for(const topic of topics){
                await this.client.subscribe(topic);
                this.logger.info(`Subscribed to topic ${topic} -> ${new Date()}`);
            }
        });
    }

    /**
     * associate the Publisher Logic
     * @param {*} function_to_execute 
     */
    RegisterMessageLogic(function_to_execute){
        this.client.on('message', function_to_execute);
    }

    /**
     * Publish a Message
     * @param {*} topic 
     * @param {*} JSON_to_send 
     */
    async Publish(topic, JSON_to_send){
        assert(topic);
        assert(JSON_to_send);
        
        this.client.on('connect', async () => {
            this.logger.info(`MQTT Publisher Client Connected -> ${new Date()}`);
            await this.client.publish(topic, JSON.stringify(JSON_to_send));
        });
    }

    /**
     * Close the client connection
     */
    async End(){
        await this.client.end();
        this.logger.info(`MQTTClient connection closed -> ${new Date()}`);
    }
}

module.exports = ASYNC_MQTT;