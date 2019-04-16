const assert = require('assert');

class IStorage {

    constructor(){}

    async Seed(collection, database){
        assert(false, `Should not use interface ${collection} ${database}`);
    }

    async Get(query, collection, database){
        assert(false, `Should not use interface ${query} ${collection} ${database}`);
    }

    async DeleteOne(query, collection, database){
        assert(false, `Should not use interface ${query} ${collection} ${database}`);
    }

    async Insert(obj, collection, database){
        assert(false, `Should not use interface ${obj} ${collection} ${database}`);
    }

}

module.exports = IStorage;