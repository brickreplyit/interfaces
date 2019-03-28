const IBom = require('../../../lib/abstraction/base/IBom');

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

class Bom extends IBom{

    constructor(){ 
        super();

        this.BOM = {
            name : 'Finished'
            , boms : [
                { name : 'outArr', inputs : [ 
                    {type : 'Plast A', length : 1}
                    ,{type : 'Faston', length : 2}
                ]
                }
                , { name : 'outAvv', inputs : [ 
                    {type : 'outArr', length : 1}
                    ,{type : 'Rame', length : 1}
                ]
                }
                , { name : 'outPrs', inputs : [ 
                    {type : 'Plast B', length : 1}
                    ,{type : 'outAvv', length : 1}
                ]
                }
                , { name : 'outTrm', inputs : [ 
                    {type : 'Plast C', length : 1}
                ]
                }
                , { name : 'Finished', inputs : [ 
                    {type : 'outPrs', length : 1}
                    ,{type : 'outTrm', length : 1}
                    ,{type : 'min', length : 5}
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