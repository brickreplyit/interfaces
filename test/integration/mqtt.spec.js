const expect = require('chai').expect;
const utilities_execution_work = require('../unit/utility.executionwork');
const implementations = require('../../server/core/Index');
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

    describe('PLANT COMMUNICATION WITH DEVICES', () => {

        it('Should work with sequential children MQTT', async function() {
        
            const test_tables =  await utilities_execution_work.TestFactoryMQTT(1440 * 60 * 1000, implementations.SequentialExecutionWork);
         
            const start_unit = 1;

            expect(test_tables.stock_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].outAvv).to.be.eq(200);

            expect(test_tables.station_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

            expect(test_tables.station_table[test_tables.start + ((4 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

            expect(test_tables.warehouse_final[test_tables.start + ((4 + start_unit) * test_tables.time_unit)].Finished).to.be.eq(1000);

        });

        it('Should Work with parallel children MQTT', async () => {
            const test_tables =  await utilities_execution_work.TestFactoryMQTT(0, implementations.ParallelExecutionWork);
         
            const start_unit = 1;
        });

    });  

});


