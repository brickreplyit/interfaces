class Core{
    
    constructor(
        __CalendarProvider, 
        __BOMProvider, 
        __WarehouseProvider, 
        __PlanProvider,
        __FactoryProvider
    ){
        this._calendarProvider = __CalendarProvider;
        this._BOMProvider = __BOMProvider;
        this._WarehouseProvider = __WarehouseProvider;
        this._PlanProvider = __PlanProvider;
        this._FactoryProvider = __FactoryProvider;
    }

    Schedule(from, to){

        if(from > to)
            return [];
            
        let productionPlannings = this._PlanProvider.getPlans();

        let bom = this._BOMProvider.getBOM();

        let warehouse = this._WarehouseProvider.getWarehouses();

        let materialFeasibility = this.MaterialCall(productionPlannings, this.PlannedBOM(bom, productionPlannings), warehouse, true);

        let plantsCapacity = this.TotalCapacityPerPlant(this._FactoryProvider.getFactories(), this._calendarProvider.getShifts(from, to));

        let result = this.MapFeasibleToFactory(materialFeasibility, plantsCapacity);

        return result;
    }

    PlannedBOM(BOM, productionPlanning){
        let _plannedBOMCodes = productionPlanning.map(function(plan){
            return plan.BOM;
        });

        return BOM.filter(bom => _plannedBOMCodes.includes(bom.Code));
    }

    MaterialCall(Plan, plannedBOM, warehouse, alsoNotFeasible){
        var feasible = [];

        plannedBOM.forEach(function(bom){
            var cnt = 0;
            while(cnt < (Plan.filter(function(b) { return bom.Code == b.BOM; })[0].Qta)){
                var materialConsumption = [];
                var isFeasible = bom.Parts.length;
                var qtaFeasible = 0;
                bom.Parts.forEach(function(part) {
                    var qta = part.Qta;
                    warehouse.forEach(function(whs) {
                        whs.Capacity.some(function(warehousePart){
                            if(warehousePart.Code == part.Code){
                                if(qta - warehousePart.Qta > 0){
                                    if(warehousePart.Qta !== 0){
                                        qta -= warehousePart.Qta;

                                        materialConsumption.push({
                                            WarehouseCode : whs.Code
                                            ,Part : warehousePart.Code
                                            ,Qta :warehousePart.Qta
                                        });

                                        warehousePart.Qta = 0;
                                    }
                                }
                                else if(qta > 0){
                                    materialConsumption.push({
                                        WarehouseCode : whs.Code
                                        ,Part : warehousePart.Code
                                        ,Qta : qta
                                    });

                                    warehousePart.Qta -= qta;
                                    qtaFeasible++;
                                    qta = 0; 
                                }
                            }  
                        });
                    });
                });
           
                if(alsoNotFeasible || (isFeasible === qtaFeasible)){
                    feasible.push({
                        BOMCode : bom.Code
                        ,Feasible : (isFeasible === qtaFeasible)
                        ,MaterialConsumption : materialConsumption
                    });
                }

                cnt++;
            }
        });

        //console.log(util.inspect(feasible, {showHidden: false, depth: null}));

        return feasible;
    }

    TotalCapacityPerPlant(plants, calendar){
        var PlantsCapacity = [];
        plants.forEach(function(plant){
            var workstationsCapacity = plant.WorkStations.map(function(es){ return es.CapacityHH;});
            var plantBottleNeck = Math.min.apply(Math, workstationsCapacity.filter(function(val) {
                return !isNaN(val);
            }));
            var plantCapacityPerDay = [];
            calendar.forEach(function(day){
                plantCapacityPerDay.push({
                    Day : day.Day
                    ,Capacity : (day.Hours * plantBottleNeck)
                });
            });
            PlantsCapacity.push({
                Plant: plant.Code
                ,PlantCapacityPerDay : plantCapacityPerDay
            });
        });

        //console.log(util.inspect(PlantsCapacity, {showHidden: false, depth: null}));

        return PlantsCapacity;
    }

    MapFeasibleToFactory(materialFeasibility, plantsCapacity){
        var QtaToProduce = materialFeasibility.length;
        var index = 0;
        var ProductionPlan = [];

        plantsCapacity.forEach(function(plant){
            plant.PlantCapacityPerDay.forEach(function(day){
                while(QtaToProduce > 0 && day.Capacity > 0){
                    day.Capacity--;
                    QtaToProduce--;
                    ProductionPlan.push({
                        PLANT: plant.Plant
                        ,DAY: day
                        ,BOM: materialFeasibility[index]
                    });
                    index++;
                }
            });
        });

        //console.log(util.inspect(ProductionPlan, {showHidden: false, depth: null}));

        return ProductionPlan;
    }
}

module.exports = Core;

