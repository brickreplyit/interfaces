const assert = require('assert');

/**
 * 
 */
class IBom{

    constructor(){}
    /** 
     * @param {*} pieces_type
     * @param {*} work_Id
    */
    async GetBom(pieces_type, work_Id)
    {
        assert(false, `should not use interface ${pieces_type} ${work_Id}`)
    }
}

module.exports  = IBom;