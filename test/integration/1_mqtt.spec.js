const expect = require('chai').expect;
const common = require('../../server/core/common/common');
const mqtt = require('../../server/core/infrastructure/mqtt/mqtt');
const config = global.gConfig;
const conn_string = config.test.integration.MQTT_ENDPOINT;

describe('INTEGRATION TESTS', () => {
    describe('MQTT SERVER', () => {
        it('Should receive a Message', () => {
            const MQTT_BROKER = new mqtt(common.MQTT_LOGGER, conn_string);

            MQTT_BROKER.Init(['TEST']);

            MQTT_BROKER.RegisterMessageLogic((topic, message) => {
                expect(message.toString()).to.be.eq(JSON.stringify({ TYPE: 'TEST' }));
                expect(topic).to.be.eq('TEST');
                MQTT_BROKER.End();
            });

            MQTT_BROKER.Publish('TEST', { TYPE: 'TEST' });
        });

        it('Should receive a Message and Close the connection', () => {
            const MQTT_BROKER = new mqtt(common.MQTT_LOGGER, conn_string);

            MQTT_BROKER.Init(['TEST']);

            MQTT_BROKER.RegisterMessageLogic(() => {
                MQTT_BROKER.End();
            });

            MQTT_BROKER.Publish('TEST', { TYPE: 'TEST' });
        });
    });
});


