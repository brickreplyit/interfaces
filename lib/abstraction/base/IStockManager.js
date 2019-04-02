const assert = require('assert');

/**
 * 
 */
class IStockManager{

    constructor(){}
    
    async GetStock()
    {
        assert(false, 'should not use interface');
    }

    /**
     * 
     * @param {*} piece_type 
     */
    async GetStockByPieceType(piece_type)
    {
        assert(false, `should not use interface ${piece_type}`);
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Consume(piece_type, quantity)
    {
        assert(false, `should not use interface ${piece_type} ${quantity}`);
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Produce(piece_type, quantity)
    {
        assert(false, `should not use interface ${piece_type} ${quantity}`);
    }

    /**
     * 
     * @param {*} piece_type 
     * @param {*} quantity 
     */
    async Reserve(piece_type, quantity)
    {
        assert(false, `should not use interface ${piece_type} ${quantity}`);
    }
}

module.exports = IStockManager;