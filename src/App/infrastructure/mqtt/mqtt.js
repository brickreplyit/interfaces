const mqtt = require('mqtt');
const abstractions = require('../../../../lib/abstraction/Index');
const assert = require('assert');

/** 
 * Implementation of MQTT.js
*/
class MQTT extends abstractions.IMQTT{

    /**
     * MQTT Constructor
     * @param {*} logger 
     * @param {*} mqtt_endpoint 
     * @param {*} topics 
     */
    constructor(logger, mqtt_endpoint, topics){
        super();
        this.logger = logger;
        this.client = mqtt.connect(mqtt_endpoint);
        this.Init(topics);
    }

    /**
     * Initialize the MQTT Subscriber 
     * @param {*} topics 
     */
    Init(topics){
        assert(topics);
        this.SubscribeAll(topics);
    }

    /**
     * Subscribe to all TOPICS
     * @param {*} topics 
     */
    SubscribeAll(topics){
        this.client.on('connect', () => {
            this.logger.info(`MQTT Subscriber Client Connected -> ${new Date()}`);
            topics.forEach((topic) => {
                this.client.subscribe(topic);
                this.logger.info(`Subscribed to topic ${topic} -> ${new Date()}`);
            });
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
    Publish(topic, JSON_to_send){
        assert(topic);
        assert(JSON_to_send);
        
        this.client.on('connect', () => {
            this.logger.info(`MQTT Publisher Client Connected -> ${new Date()}`);
            this.client.publish(topic, JSON.stringify(JSON_to_send));
        });
    }

    /**
     * Close the client connection
     */
    End(){
        this.client.end();
        this.logger.info(`MQTTClient connection closed -> ${new Date()}`);
    }
}

module.exports = MQTT;