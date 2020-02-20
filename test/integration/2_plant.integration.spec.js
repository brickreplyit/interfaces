const expect = require('chai').expect;
const utilities_execution_work = require('../unit/utility.executionwork');
const implementations = require('../../server/core/Index');

describe('INTEGRATION TESTS', () => {

    describe('PLANT COMMUNICATION WITH DEVICES', () => {

        it('Should work with sequential children MQTT', async function() {
            this.timeout(120000);
            const test_tables =  await utilities_execution_work.TestFactoryMQTT(1440 * 60 * 1000, implementations.SequentialExecutionWork);
         
            const start_unit = 1;

            expect(test_tables.stock_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].outAvv).to.be.eq(200);

            expect(test_tables.station_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

            expect(test_tables.station_table[test_tables.start + ((4 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

            expect(test_tables.warehouse_final[test_tables.start + ((4 + start_unit) * test_tables.time_unit)].Finished).to.be.eq(1000);

        });

        it('Should Work with parallel children MQTT', async function() {
            this.timeout(120000);
            const test_tables =  await utilities_execution_work.TestFactoryMQTT(0, implementations.ParallelExecutionWork);
         
            const start_unit = 1;
        });

        it('Should work with sequential children MQTT & MANUAL');

        it('Should Work with parallel children MQTT & MANUAL');

    });  

});


