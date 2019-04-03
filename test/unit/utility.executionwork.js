const entities = require('../../lib/entity/Index');
const implementations = require('../../src/Core/Index');

const dbg = require('debug')('platform:abstraction:test');

function GenerateChildFactory(operation_factory, operation, bom, time, stockManager, testTimeIncremental){
    const child_operations = {};

    if(undefined !== operation_factory)
    {
        for(var elem = 0; elem < operation_factory.length; elem++)
        {
            const name = operation_factory[elem].name;
            const child_op = operation_factory[elem].operations;
            
            child_operations[name] = new implementations.ExecutionWork(name, operation, child_op, time, bom, stockManager);
            child_operations[name].TestTimeIncremental = testTimeIncremental;
            
        }
    }

    return child_operations;
}

async function TestFactory(workstation_time_unit, parent_work_type){
    let t = 946681200000;

    const start = t;
    const time_unit  =  1440 * 60 * 1000;
    const operation_factory = (await (new implementations.Operation()).GetOperation({}, 'plant')).operations;
    const operation = new implementations.Operation(); 
    const bom = new implementations.BOM();
    const stock = new implementations.StockManager();
    const final = {};
    const produced_final = {};
    const stock_final = {};
    for(var production_day = 0; production_day < 5; production_day++)
    {
         
        const time = new implementations.Time(t = t + time_unit);
        const child_operations = GenerateChildFactory(operation_factory, operation, bom, time, stock, workstation_time_unit);
        const ew = new parent_work_type('plant', new implementations.Operation(), child_operations, time, bom, stock);
        
        const result = new implementations.Completion(time, stock);
        await ew.Work(new entities.Pieces(200, 'ProductionOrder'), result, 'plant');
        final[t] = result.result;
        produced_final[t] = result.result;
        stock_final[t] = result.StockManager.Warehouse.stocks;
        
    }

    const start_times = Object.keys(final);
    const station_table = {};
    const stock_table = {};
    const warehouse_table = {};

    //loop day
    for(let j = 0; j < start_times.length; j++)
    {
        const day =  final[start_times[j]];
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
        const daily_stock =  stock_final[start_times[j]];
        
        for(let item of daily_stock){
            if(undefined === warehouse_table[start_times[j]])
                warehouse_table[start_times[j]] = {};
            else
                warehouse_table[start_times[j]][item['piece']] = item['quantity']; 
        }
        
    }

    //dbg('warehouse', warehouse_table);

    return {
        station_table
        ,stock_table 
        , warehouse_table 
        , start
        ,time_unit
    };
}


module.exports = {
    GenerateChildFactory
    , TestFactory
};
