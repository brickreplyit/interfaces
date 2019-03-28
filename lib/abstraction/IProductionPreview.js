const assert = require('assert');
/**
 * 
 */
class IProductionPreview {    
    
    constructor(){}

    /**
     * 
     * @param {*} from 
     * @param {*} to 
     * @param {*} time_unit 
     */
    async forecast(from, to, time_unit)
    {
        assert(false, `should not use interface ${from} ${to} ${time_unit}`);
    }
}

module.exports = IProductionPreview;