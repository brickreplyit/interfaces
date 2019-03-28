const expect = require('chai').expect;
const Core = require('../../../App/Core/Core');

const CalendarProvider = require('../../providers/CalendarProvider/Calendar');
const BOMProvider = require('../../providers/BOMProvider/BOMProvider');
const WarehouseProvider = require('../../providers/WarehouseProvider/Warehouseprovider');
const PlanProvider = require('../../providers/PlanProvider/PlanProvider');
const FactoryProvider = require('../../providers/FactoryProvider/FactoryProvider');

describe('CORE', function () {
    it('should return an empty List', function () {
        var core = new Core(new CalendarProvider(), new BOMProvider(), new WarehouseProvider(), new PlanProvider(), new FactoryProvider());
        var results = core.Schedule(new Date(2020, 11, 24, 10, 33, 30, 0), new Date(2019, 1, 31, 10, 33, 30, 0));
        expect(results.length).to.be.equal(0, '');
    });

    it('should return a non empty List', function () {
        var core = new Core(new CalendarProvider(), new BOMProvider(), new WarehouseProvider(), new PlanProvider(), new FactoryProvider());
        var results = core.Schedule(new Date(2019, 1, 24, 10, 33, 30, 0), new Date(2019, 1, 31, 10, 33, 30, 0));
        expect(results.length).to.be.above(0, '');
    });
});