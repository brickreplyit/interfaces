const expect = require('chai').expect;
const util   = require('./utility');
const dbg = require('debug')('platform:abstraction:test');



const IProductionPreview = require('../../lib/abstraction/IProductionPreview');
const IBom = require('../../lib/abstraction/base/IBom');
const IOperation = require('../../lib/abstraction/base/IOperation');
const ICompletion = require('../../lib/abstraction/base/ICompletion');
const IExecutionWork = require('../../lib/abstraction/IExecutionWork');

const ExecutionWork = require('../unit/Core/ExecutionWork');
const Operation = require('../unit/Core/Operation');
const Pieces = require('../../lib/entity/Pieces');
const Completion = require('../unit/Core/Completion');
const Time = require('../unit/Core/Time');
const BOM = require('../unit/Core/Bom');
const StockManager = require('../unit/Core/StockManager');

async function test_throw(func)
{
    let thrown = false;

    try{
        if(util.isAsync(func))
        {
            await func();
        }
        else
        {
            func();
        }
    }catch(err)
    {
        thrown = true;
    }

    return thrown;
}



describe('all abstraction should throw', () => {

    describe('IProductionPreview',  () =>{
        
        const production_preview = new IProductionPreview();

        const target = production_preview; 

        //test_abstraction(target);

        const func = util.get_all_functions(target);

        func.forEach((f) => {
                
            it('interface method ' + f + ' should throw', async () => {
                
                const func = target[f];

                const thrown = await test_throw(func);

                expect(thrown).to.be.true;
                
            });

        });
             
    });

    describe('IBom',  () =>{
        
        const BOM = new IBom();

        const target = BOM; 

        //test_abstraction(target);

        const func = util.get_all_functions(target);

        func.forEach((f) => {
                
            it('interface method ' + f + ' should throw', async () => {
                
                const func = target[f];

                const thrown = await test_throw(func);

                expect(thrown).to.be.true;
                
            });

        });
             
    });

    describe('IOperation',  () =>{
        
        const operation = new IOperation();

        const target = operation; 

        //test_abstraction(target);

        const func = util.get_all_functions(target);

        func.forEach((f) => {
                
            it('interface method ' + f + ' should throw', async () => {
                
                const func = target[f];

                const thrown = await test_throw(func);

                expect(thrown).to.be.true;
                
            });

        });
             
    });

    describe('ICompletion',  () =>{
        
        const completion = new ICompletion();

        const target = completion; 

        //test_abstraction(target);

        const func = util.get_all_functions(target);

        func.forEach((f) => {
                
            it('interface method ' + f + ' should throw', async () => {
                
                const func = target[f];

                const thrown = await test_throw(func);

                expect(thrown).to.be.true;
                
            });

        });
             
    });

    describe('IExecutionWork',  () =>{
        
        const execution_work = new IExecutionWork();

        const target = execution_work; 

        //test_abstraction(target);

        const func = util.get_all_functions(target);

        func.forEach((f) => {
                
            it('interface method ' + f + ' should throw', async () => {
                
                const func = target[f];

                const thrown = await test_throw(func);

                expect(thrown).to.be.true;
                
            });

        });
             
    });
});

describe('test framework', ( )=>{
    
    it('should work', async () => {
        
        const fake_tester = {

            this_is_a_property : ''
            , this_is_a_non_throwing_function(){}

        };

        expect(
            util.isAsync(fake_tester.this_is_a_non_throwing_function)
        ).to.be.false;

        const functions = util.get_all_functions(fake_tester);

        expect(functions).to.include('this_is_a_non_throwing_function');
        expect(functions).not.to.include('this_is_a_property');

        let thrown = await test_throw(fake_tester.this_is_a_non_throwing_function);

        expect(thrown).to.be.false;
        
        thrown = await test_throw(util.async_function);

        expect(thrown).to.be.false;

        

    });
});



describe('Plant', () => {
    it('Should return BOM', async () => {
        const bom = new BOM();

        let result = await bom.GetBom('Finished', null);

        expect(result.boms.length).to.be.eq(5);

        result = await bom.GetBom('outArr', null);

        expect(result.inputs[0]).to.be.not.null;

        expect(result.inputs[0].type).to.be.eq('Plast A');

    });

    it('IWork should work', async () => {
        
        let t = 946681200000;

        const start = t;

        const time_unit  =  1440 * 60 * 1000;

        const operation_factory = (await (new Operation()).GetOperation({}, 'plant')).operations;

        const operation = new Operation(); 

        const bom = new BOM();

        const stock = new StockManager();

        const final = {};

        const stock_final = {};

        for(var production_day = 0; production_day < 5; production_day++)
        {
             
            const time = new Time(t = t + time_unit);

            const child_operations = {};

            if(undefined !== operation_factory)
            {
                for(var elem = 0; elem < operation_factory.length; elem++)
                {
                    const name = operation_factory[elem].name;
                    const child_op = operation_factory[elem].operations;
                    
                    child_operations[name] = new ExecutionWork(name, operation, child_op, time, bom, stock);
                    
                }
            }

            const ew = new ExecutionWork('plant', new Operation(), child_operations, time, bom, stock);
            
            const result = new Completion(time);

            await ew.Work(new Pieces(200, 'ProductionOrder'), result, 'plant');

            final[t] = result.result;

            stock_final[t] = result.result; 
            
        }
        
        //dbg('end date', new Date(t));
        //dbg('result', JSON.stringify(final, null, 4));

        const start_times = Object.keys(final);

        const station_table = {};
        const stock_table = {};
        const warehouse_table = {};

        //dbg('time key',  start_times);

        //loop day
        for(let j = 0; j < start_times.length; j++)
        {
            const day =  final[start_times[j]];
            //dbg('work', j,);
            //loop station
            const workUnits = Object.keys(day);

            for(let k= 0; k < workUnits.length; k++)
            {
                const work_unit = workUnits[k];

                const station = day[workUnits[k]];

                const station_time = station.time;

                const pieces_type = station.production.pieces.type;

                let pieces = station.production.pieces.length;

                if(undefined === station_table[station_time])
                    station_table[station_time] = {};
                else
                if(undefined === station_table[station_time][work_unit])
                    station_table[station_time][work_unit] = 0;
                else
                    pieces = pieces + station_table[station_time][work_unit];

                station_table[station_time][work_unit] = pieces;

                pieces = station.production.pieces.length;

                if(undefined === stock_table[station_time])
                    stock_table[station_time] = {};
                else
                if(undefined === stock_table[station_time][pieces_type])
                    stock_table[station_time][pieces_type] = 0;
                else
                    pieces = pieces + stock_table[station_time][pieces_type];

                stock_table[station_time][pieces_type] = pieces;
                                
            }
        }

        for(let j = 0; j < start_times.length; j++)
        {
            const day =  final[start_times[j]];
            //dbg('work', j,);
            //loop station
            const workUnits = Object.keys(day);

            for(let k= 0; k < workUnits.length; k++)
            {
                const station = day[workUnits[k]];

                const station_time = station.time;

                const pieces_type = station.production.pieces.type;

                if(undefined === warehouse_table[station_time])
                    warehouse_table[station_time] = {};
                else
                if(undefined === warehouse_table[station_time][pieces_type])
                    warehouse_table[station_time][pieces_type] = 0;

                warehouse_table[station_time][pieces_type] = station.production.consumptionItems;

            }
        }

        // dbg('station table', station_table);
        // dbg('stock table', stock_table);
        dbg('daily consumption table table', JSON.stringify(warehouse_table, null, 4));

        const start_unit = 1;

        //dbg('time 2', start + ((2 + start_unit) * time_unit));

        expect(stock_table[start + ((2 + start_unit) * time_unit)].outAvv).to.be.eq(200);
        expect(station_table[start + ((2 + start_unit) * time_unit)].AVV).to.be.eq(200);

        expect(station_table[start + ((4 + start_unit) * time_unit)].AVV).to.be.eq(200);

        //dbg('stock_final', JSON.stringify(stock_final, null, 4));
    });

});