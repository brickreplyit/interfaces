const abstraction = require('../../../lib/abstraction/Index');

function filter_bom(bs, target)
{
    if(bs.name == target)
        return bs;

    if(undefined === bs.boms)
        return null;

    for(let i = 0; bs.boms.length; i++)
    {
        const op = bs.boms[i];

        let op_target = filter_bom(op, target);
        if(null != op_target)
            return op_target;
    }
}

class Bom extends abstraction.IBom{

    constructor(){ 
        super();

        this.BOM = {
            name : 'BOM_Finished'
            , boms : [
                { 
                    name : 'outArr', inputs : [ 
                        {type : 'Plast A', quantity : 1}
                        ,{type : 'Faston', quantity : 2}
                    ]
                }
                , { 
                    name : 'outAvv', inputs : [ 
                        {type : 'outArr', quantity : 1}
                        ,{type : 'Rame', quantity : 1}
                    ]
                }
                , {
                    name : 'outPrs', inputs : [ 
                        {type : 'Plast B', quantity : 1}
                        ,{type : 'outAvv', quantity : 1}
                    ]
                }
                , { 
                    name : 'outTrm', inputs : [ 
                        {type : 'Plast C', quantity : 1}
                    ]
                }
                , { 
                    name : 'Finished', inputs : [ 
                        {type : 'outPrs', quantity : 1}
                        ,{type : 'outTrm', quantity : 1}
                        ,{type : 'Min', quantity : 5}
                    ]
                }
            ]
        };
    }

    async GetBom(piece_type, work_id){
        return filter_bom(this.BOM, piece_type);
    }
}

module.exports = Bom;