const Router = require('koa-router');

const router = new Router({
    prefix: '/work'
});
const mongodb = require('mongodb');
const MongoDBStorage = require('../core/Index').MongoDBStorage;
const common = require('../core/common/common');
const MQTT = require('../core/infrastructure/mqtt/mqtt');
const config = global.gConfig;
const conn_string = config.test.integration.MQTT_ENDPOINT;


const Storage = new MongoDBStorage('mongodb://0.0.0.0:27017/');

router.get('/:workId', async (ctx, next) => {

    const res = await GetData(ctx.params.workId);

    ctx.body = res;

    next();
});

router.get('/', async (ctx, next) => {

    const res = await GetAll();

    ctx.body = res;

    next();
});

router.post('/', async (ctx, next) => {
    try{
        const MQTT_BROKER = new MQTT(common.MQTT_LOGGER,conn_string);

        MQTT_BROKER.PublishCallback(`${ctx.request.body.workId}_MANUAL_END`, ctx.request.body, () => {
            MQTT_BROKER.End();
        });

        await RemoveData(ctx.request.body);
    
        ctx.response.status = 201;
        ctx.body = {
            status: 'success'
            ,message: `New ItemProduced added with id: ${ctx.request.body}`
        };
    }catch(err)
    {
        ctx.response.status = 500;
    }
    next();
});

function GetAll(){
    return Storage.Get({ }, 'ProductionDocument', 'EW');
}

function GetData(workId){
    return Storage.Get({ workId : workId }, 'ProductionDocument', 'EW');
}

function RemoveData(item){
    console.log(item);
    console.log(new mongodb.ObjectID(item._id));
    return Storage.DeleteOne({ '_id': new mongodb.ObjectID(item._id) }, 'ProductionDocument', 'EW');
}

module.exports = router;