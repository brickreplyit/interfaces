const expect = require('chai').expect;
const common = require('../../src/App/common/common');
const mqtt = require('../../src/App/infrastructure/mqtt/mqtt');
const async_mqtt = require('../../src/App/infrastructure/mqtt/asyncMqtt');
const config = global.gConfig;
const conn_string = config.test.integration.MQTT_ENDPOINT || 'mqtt://0.0.0.0:1883';

describe('MQTT', () => {
    it('Should receive a Message', () => {
        const MQTT_BROKER = new mqtt(common.MQTT_LOGGER, conn_string, ['TEST']);

        MQTT_BROKER.RegisterMessageLogic((topic, message) => {
            expect(message.toString()).to.be.eq(JSON.stringify({ TYPE: 'TEST' }));
            expect(topic).to.be.eq('TEST');
            MQTT_BROKER.End();
        });

        MQTT_BROKER.Publish('TEST', { TYPE: 'TEST' });
    });

    it('Should receive a Message and Close the connection', () => {
        const MQTT_BROKER = new mqtt(common.MQTT_LOGGER, conn_string, ['TEST']);

        MQTT_BROKER.RegisterMessageLogic(() => {
            MQTT_BROKER.End();
        });

        MQTT_BROKER.Publish('TEST', { TYPE: 'TEST' });
    });
});


describe('ASYNC MQTT', () => {
    it('Should receive a Message',async () => {
        const MQTT_BROKER = new async_mqtt(common.MQTT_LOGGER, conn_string);

        await MQTT_BROKER.Init(['TEST']);

        MQTT_BROKER.RegisterMessageLogic(async (topic, message) => {
            expect(message.toString()).to.be.eq(JSON.stringify({ TYPE: 'TEST' }));
            expect(topic).to.be.eq('TEST');
            await MQTT_BROKER.End();
        });

        await MQTT_BROKER.Publish('TEST', { TYPE: 'TEST' });
    });

    it('Should receive a Message and Close the connection',async () => {
        const MQTT_BROKER = new async_mqtt(common.MQTT_LOGGER, conn_string);

        await MQTT_BROKER.Init(['TEST']);

        MQTT_BROKER.RegisterMessageLogic(async () => {
            await MQTT_BROKER.End();
        });

        await MQTT_BROKER.Publish('TEST', { TYPE: 'TEST' });
    });
});
