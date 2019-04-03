const expect = require('chai').expect;
const utilities_execution_work = require('./utility.executionwork');
const implementations = require('../../src/Core/Index');
const dbg = require('debug')('platform:abstraction:test');

describe('Plant', () => {
    it('Should return BOM', async () => {
        const bom = new implementations.BOM();

        let result = await bom.GetBom('Finished', null);

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
        
        const test_tables =  await utilities_execution_work.TestFactory(1440 * 60 * 1000, implementations.ExecutionWork);
         
        const start_unit = 1;

        expect(test_tables.stock_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].outAvv).to.be.eq(200);

        expect(test_tables.station_table[test_tables.start + ((2 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

        expect(test_tables.station_table[test_tables.start + ((4 + start_unit) * test_tables.time_unit)].AVV).to.be.eq(200);

    });

    it('Should Work with parallel children', async () => {
        const test_tables =  await utilities_execution_work.TestFactory(0, implementations.ParallelExecutionWork);
         
        const start_unit = 1;
    });

    it('Should Work shared workstations semaphore (multiple lines)');

    it('Should Work join parent stations');

    describe('Stock Manager', () => {
        it('Should have a method to receive pieces and consumption');
    });

}); 