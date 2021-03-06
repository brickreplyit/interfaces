const expect = require('chai').expect;
const assert = require('assert');
const utilities_execution_work = require('./utility.executionwork');
const implementations = require('../../server/core//Index');
const dbg = require('debug')('platform:abstraction:test');

describe('Plant', () => {

    it('Should return BOM', async () => {
        const bom = new implementations.BOM();

        let result = await bom.GetBom('BOM_Finished', null);

        expect(result.boms.length).to.be.eq(5);

        result = await bom.GetBom('outArr', null);

        expect(result.inputs[0]).to.be.not.null;

        expect(result.inputs[0].type).to.be.eq('Plast A');

    });

    it('Should return Time', async () => {
        const time = new implementations.Time();

        const result = await time.getTime();

        expect(result).to.be.not.null;

    });

    it('Should work with sequential children', async () => {
        
        const test_tables =  await utilities_execution_work.TestFactory(1440 * 60 * 1000, implementations.SequentialExecutionWork);
         
        const start_unit = 1;

        expect(test_tables.stock_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].outAvv).to.be.eq(200);

        expect(test_tables.station_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

        expect(test_tables.station_table[test_tables.start + ((4 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

        expect(test_tables.warehouse_final[test_tables.start + ((4 + start_unit) * test_tables.time_unit)].Finished).to.be.eq(1000);

    });

    it('Should Work with parallel children', async () => {
        const test_tables =  await utilities_execution_work.TestFactory(0, implementations.ParallelExecutionWork);
         
        const start_unit = 1;
    });

    it('Should Work shared workstations semaphore (multiple lines)');

    it('Should Work join parent stations');

});  