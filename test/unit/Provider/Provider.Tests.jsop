const expect = require('chai').expect;
const CalendarProvider = require('../../providers/CalendarProvider/Calendar');
const BOMProvider = require('../../providers/BOMProvider/BOMProvider');
const WarehouseProvider = require('../../providers/WarehouseProvider/Warehouseprovider');
const PlanProvider = require('../../providers/PlanProvider/PlanProvider');
const FactoryProvider = require('../../providers/FactoryProvider/FactoryProvider');

describe('Calendar Provider', function () {
    it('should return a non empty List', function () {
        var provider = new CalendarProvider();
        var shiftList = provider.getShifts(new Date(2016, 11, 24, 10, 33, 30, 0), new Date(2019, 1, 31, 10, 33, 30, 0));
        expect(shiftList.length).to.be.above(0, '');
    });

    it('should return 7 elem', function () {
        var provider = new CalendarProvider();
        var shiftList = provider.getShifts(new Date(2019, 1, 24, 10, 33, 30, 0), new Date(2019, 1, 31, 10, 33, 30, 0));
        expect(shiftList.length).to.be.equal(7, '');
    });
});

describe('BOM Provider', function () {
    it('should return a non empty List', function () {
        var provider = new BOMProvider();
        var bomList = provider.getBOM();
        expect(bomList.length).to.be.above(0, '');
    });
});

describe('Warehouse Provider', function () {
    it('should return a non empty List', function () {
        var provider = new WarehouseProvider();
        var whList = provider.getWarehouses();
        expect(whList.length).to.be.above(0, '');
    });
});

describe('Plan Provider', function () {
    it('should return a non empty List', function () {
        var provider = new PlanProvider();
        var plansLst = provider.getPlans();
        expect(plansLst.length).to.be.above(0, '');
    });
});

describe('Factory Provider', function () {
    it('should return a non empty List', function () {
        var provider = new FactoryProvider();
        var plantLst = provider.getFactories();
        expect(plantLst.length).to.be.above(0, '');
    });
});