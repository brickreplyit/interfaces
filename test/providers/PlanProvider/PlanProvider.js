const DB = require('./Plan.Data.json');

class PlanProvider{
    constructor(){
    }

    getPlans(){
        return DB.Planned;
    }
}

module.exports = PlanProvider;