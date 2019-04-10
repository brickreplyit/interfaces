const COMMON_SERVICES = require('./common/common');
const MQTT = require('./infrastructure/mqtt/mqtt');

const CONNECTION_STRING = 'mqtt://0.0.0.0:1883';

const MQTT_BROKER = new MQTT(COMMON_SERVICES.MQTT_LOGGER, CONNECTION_STRING, ['TEST']);

MQTT_BROKER.RegisterMessageLogic(function (topic, message) {
    COMMON_SERVICES.MQTT_LOGGER.info(`TOPIC: ${topic} MESSAGE: ${message.toString()} -> ${new Date()}`);
    MQTT_BROKER.End();
});

MQTT_BROKER.Publish('TEST', {TYPE: 'TEST'});











